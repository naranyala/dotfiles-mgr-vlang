#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

"$ROOT/build.sh"

echo "=== running ==="
GDK_BACKEND=x11 "$ROOT/main"
