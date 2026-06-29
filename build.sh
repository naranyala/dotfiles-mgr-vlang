#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== vcpkg: installing dependencies ==="
"$ROOT/.vcpkg/vcpkg" install --triplet x64-linux --x-manifest-root="$ROOT" --x-install-root="$ROOT/vcpkg_installed"

echo "=== webview: building static library ==="
make -C "$ROOT/lib/webview"

echo "=== frontend: building bundle ==="
(cd "$ROOT/frontend" && bun run build.js)

echo "=== V: compiling application ==="
v -cc gcc \
  -cflags "$(pkg-config --cflags gtk+-3.0 webkit2gtk-4.1)" \
  -o "$ROOT/main" "$ROOT/."

echo "=== done ==="
