#!/bin/bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

LIB_DIR="lib"
WEBVIEW_DIR="$LIB_DIR/webview"
WEBVIEW_REPO="https://github.com/nicedoc/webview.git"
WEBVIEW_TAG="0.12.0"

if [ -d "$WEBVIEW_DIR/include" ]; then
  echo "✓ lib/webview already exists, skipping download."
  exit 0
fi

echo "→ Downloading webview $WEBVIEW_TAG ..."
rm -rf "$WEBVIEW_DIR"
TMPDIR=$(mktemp -d)
git clone --depth 1 --branch "$WEBVIEW_TAG" "$WEBVIEW_REPO" "$TMPDIR/webview-src"

mkdir -p "$WEBVIEW_DIR"
cp -r "$TMPDIR/webview-src/include" "$WEBVIEW_DIR/"
cp -r "$TMPDIR/webview-src/src" "$WEBVIEW_DIR/"
cp "$TMPDIR/webview-src/Makefile" "$WEBVIEW_DIR/"

rm -rf "$TMPDIR"
echo "✓ lib/webview downloaded."
