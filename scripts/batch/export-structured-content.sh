#!/usr/bin/env bash

set -euo pipefail

: "${LIFERAY_HOST:=http://localhost:8080}"
: "${LIFERAY_USER:=test@liferay.com}"
: "${LIFERAY_PASSWORD:=test}"
: "${LIFERAY_ERC_PREFIX:=NXC-}"
: "${LIFERAY_SITE_ID:?Set LIFERAY_SITE_ID to the current site ID or site ERC.}"

for command in curl jq node unzip; do
    if ! command -v "$command" >/dev/null 2>&1; then
        echo "Missing required command: $command" >&2
        exit 1
    fi
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_PATH="$REPOSITORY_ROOT/client-extensions/nexcent-content-batch/batch/10-structured-content.batch-engine-data.json"
WORK_DIR="$(mktemp -d)"
CLASS_NAME="com.liferay.headless.delivery.dto.v1_0.StructuredContent"

cleanup() {
    rm -rf "$WORK_DIR"
}

trap cleanup EXIT

echo "Creating Structured Content export task for site $LIFERAY_SITE_ID..."

TASK_RESPONSE="$(
    curl --fail --silent --show-error \
        "$LIFERAY_HOST/o/headless-batch-engine/v1.0/export-task/$CLASS_NAME/jsont?siteId=$LIFERAY_SITE_ID" \
        --header "Content-Type: application/json" \
        --request POST \
        --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
)"
TASK_ID="$(jq -r '.id' <<<"$TASK_RESPONSE")"

if [[ -z "$TASK_ID" || "$TASK_ID" == "null" ]]; then
    echo "Unable to read export task ID:" >&2
    echo "$TASK_RESPONSE" >&2
    exit 1
fi

echo "Export task $TASK_ID created."

for _ in $(seq 1 60); do
    TASK_RESPONSE="$(
        curl --fail --silent --show-error \
            "$LIFERAY_HOST/o/headless-batch-engine/v1.0/export-task/$TASK_ID" \
            --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
    )"
    STATUS="$(jq -r '.executeStatus' <<<"$TASK_RESPONSE")"

    case "$STATUS" in
        COMPLETED)
            break
            ;;
        FAILED)
            jq -r '.errorMessage' <<<"$TASK_RESPONSE" >&2
            exit 1
            ;;
        *)
            echo "Export status: $STATUS"
            sleep 2
            ;;
    esac
done

if [[ "${STATUS:-}" != "COMPLETED" ]]; then
    echo "Export task did not complete within 120 seconds." >&2
    exit 1
fi

curl --fail --silent --show-error \
    "$LIFERAY_HOST/o/headless-batch-engine/v1.0/export-task/$TASK_ID/content" \
    --output "$WORK_DIR/export.zip" \
    --user "$LIFERAY_USER:$LIFERAY_PASSWORD"

unzip -q "$WORK_DIR/export.zip" -d "$WORK_DIR/export"

EXPORTED_FILE="$(find "$WORK_DIR/export" -type f | head -n 1)"

if [[ -z "$EXPORTED_FILE" ]]; then
    echo "The export ZIP did not contain a payload file." >&2
    exit 1
fi

node "$SCRIPT_DIR/prepare-structured-content-export.mjs" \
    "$EXPORTED_FILE" \
    "$OUTPUT_PATH" \
    "$LIFERAY_ERC_PREFIX"

echo "Batch payload ready: $OUTPUT_PATH"
echo "Basic authentication is used only for this local lab script."
