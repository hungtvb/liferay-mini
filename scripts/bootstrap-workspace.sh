#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAPPER_JAR="$ROOT_DIR/gradle/wrapper/gradle-wrapper.jar"
TEMP_DIR="$ROOT_DIR/bootstrap-workspace-tmp"
PRODUCT="dxp-2026.q1.1-lts"

if [[ -f "$WRAPPER_JAR" ]]; then
	echo "Gradle Wrapper is already initialized: $WRAPPER_JAR"
	exit 0
fi

if ! command -v blade >/dev/null 2>&1; then
	echo "Blade CLI is required. Install Blade CLI, run 'blade update', and retry." >&2
	exit 1
fi

rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

pushd "$TEMP_DIR" >/dev/null
blade init -v "$PRODUCT" generated-workspace
popd >/dev/null

mkdir -p "$ROOT_DIR/gradle/wrapper"
cp "$TEMP_DIR/generated-workspace/gradle/wrapper/gradle-wrapper.jar" "$WRAPPER_JAR"
cp "$TEMP_DIR/generated-workspace/gradlew" "$ROOT_DIR/gradlew"
cp "$TEMP_DIR/generated-workspace/gradlew.bat" "$ROOT_DIR/gradlew.bat"
chmod +x "$ROOT_DIR/gradlew"

rm -rf "$TEMP_DIR"

echo "Workspace wrapper initialized successfully."
echo "Next command: ./gradlew initBundle"
