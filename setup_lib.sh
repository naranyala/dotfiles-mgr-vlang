#!/bin/bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

LIB_DIR="lib"

# --- Webview ---
WEBVIEW_DIR="$LIB_DIR/webview"
WEBVIEW_REPO="https://github.com/nicedoc/webview.git"
WEBVIEW_TAG="0.12.0"

if [ ! -d "$WEBVIEW_DIR/include" ]; then
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
else
  echo "✓ lib/webview already exists, skipping."
fi

# --- SQLite ---
SQLITE_DIR="$LIB_DIR/sqlite"
SQLITE_URL="https://www.sqlite.org/2025/sqlite-amalgamation-3490100.zip"

if [ ! -f "$SQLITE_DIR/sqlite3.h" ]; then
  echo "→ Downloading SQLite amalgamation ..."
  mkdir -p "$SQLITE_DIR"
  TMPDIR=$(mktemp -d)
  curl -sL "$SQLITE_URL" -o "$TMPDIR/sqlite.zip"
  unzip -o -q "$TMPDIR/sqlite.zip" -d "$TMPDIR"
  mv "$TMPDIR"/sqlite-amalgamation-*/sqlite3.* "$SQLITE_DIR/"
  rm -rf "$TMPDIR"
  echo "✓ lib/sqlite downloaded."
else
  echo "✓ lib/sqlite already exists, skipping."
fi

echo "✓ All libraries ready."
