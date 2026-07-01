#!/bin/bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "=== Setting up lib/ ==="
./setup_lib.sh

echo "=== Building webview static library ==="
g++ -c -fPIC -I lib/webview/include \
    $(pkg-config --cflags webkit2gtk-4.1) \
    -o /tmp/webview.o -x c++ - << 'EOF'
#define WEBVIEW_STATIC
#define WEBVIEW_IMPLEMENTATION
#define WEBVIEW_GTK
#include <webview/webview.h>
EOF
ar rcs lib/webview/libwebview_new.a /tmp/webview.o
echo "  -> lib/webview/libwebview_new.a"

if [ ! -f lib/sqlite/libsqlite3.a ]; then
  echo "=== Building SQLite static library ==="
  gcc -c -fPIC -o /tmp/sqlite3.o lib/sqlite/sqlite3.c
  ar rcs lib/sqlite/libsqlite3.a /tmp/sqlite3.o
  rm -f /tmp/sqlite3.o
  echo "  -> lib/sqlite/libsqlite3.a"
else
  echo "=== SQLite static library already built ==="
fi

echo "=== Building frontend ==="
if [ -f frontend/package.json ]; then
    cd frontend
    bun install 2>/dev/null || npm install 2>/dev/null || true
    node build.js 2>/dev/null || true
    cd "$DIR"
fi

echo "=== Building V application ==="
v -cc gcc -enable-globals -o main .

echo "=== Done: ./main ==="
