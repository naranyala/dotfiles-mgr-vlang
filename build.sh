#!/bin/bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

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

echo "=== Building frontend ==="
if [ -f frontend/package.json ]; then
    cd frontend
    bun install 2>/dev/null || npm install 2>/dev/null || true
    node build.js 2>/dev/null || true
    cd "$DIR"
fi

echo "=== Building V application ==="
v -cc gcc -o main .

echo "=== Done: ./main ==="
