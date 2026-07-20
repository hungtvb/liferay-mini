#!/usr/bin/env bash
set -euo pipefail

SOURCE_REPO="https://github.com/StepanovVVV/Nexcent.git"
SOURCE_COMMIT="7d6c7dbc57be24febeca0e18fabdd35278809039"
TARGET_DIR="prototypes/nexcent-static"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Cloning Nexcent reference source..."
git clone --quiet --no-checkout "$SOURCE_REPO" "$TMP_DIR/source"
git -C "$TMP_DIR/source" checkout --quiet "$SOURCE_COMMIT"

mkdir -p "$TARGET_DIR"
rm -rf "$TARGET_DIR/css" "$TARGET_DIR/js" "$TARGET_DIR/icons" "$TARGET_DIR/img"

cp "$TMP_DIR/source/index.html" "$TARGET_DIR/index.html"
cp -R "$TMP_DIR/source/css" "$TARGET_DIR/css"
cp -R "$TMP_DIR/source/js" "$TARGET_DIR/js"
cp -R "$TMP_DIR/source/icons" "$TARGET_DIR/icons"
cp -R "$TMP_DIR/source/img" "$TARGET_DIR/img"
cp "$TMP_DIR/source/favicon.ico" "$TARGET_DIR/favicon.ico"

# Preserve project-specific integration files already present in TARGET_DIR.
# The imported index uses only the reference css/js/icons/img paths above.

if ! grep -Eq '>Login<|>Login[[:space:]]*<' "$TARGET_DIR/index.html"; then
  echo "Expected Login action was not found in imported header." >&2
  exit 1
fi

python3 - "$TARGET_DIR/index.html" "$TARGET_DIR" <<'PY'
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import sys

html_path = Path(sys.argv[1])
root = Path(sys.argv[2])

class LocalAssetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("src", "href"):
            value = attrs.get(key)
            if not value:
                continue
            parsed = urlparse(value)
            if parsed.scheme or value.startswith(("#", "//")):
                continue
            path = parsed.path
            if not path or path == "#!":
                continue
            self.paths.append(path.lstrip("./"))

parser = LocalAssetParser()
parser.feed(html_path.read_text(encoding="utf-8"))
missing = sorted({path for path in parser.paths if not (root / path).exists()})
if missing:
    print("Missing imported assets:", file=sys.stderr)
    for path in missing:
        print(f"- {path}", file=sys.stderr)
    raise SystemExit(1)

print(f"Validated {len(set(parser.paths))} local references.")
PY

cat > "$TARGET_DIR/REFERENCE_SOURCE.md" <<EOF
# Nexcent visual reference port

- Source site: https://stepanovvvv.github.io/Nexcent/
- Source repository: https://github.com/StepanovVVV/Nexcent
- Imported commit: \`$SOURCE_COMMIT\`
- Import target: \`$TARGET_DIR\`

The imported HTML, CSS, JavaScript, images, and icons are used as the visual baseline for the Nexcent Liferay implementation. Project-specific Headless/Liferay integration files remain in the directory but are not loaded by the imported reference \`index.html\` until the visual port is accepted.
EOF

echo "Nexcent reference imported from $SOURCE_COMMIT"
