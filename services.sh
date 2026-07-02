#!/bin/bash
# Start llama-server and tts-runner Python services
# Usage: bash services.sh [llama|tts|all]
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
MODE="${1:-all}"

if [ "$MODE" = "all" ] || [ "$MODE" = "tts" ]; then
    echo "=== Starting TTS Runner on :8082 ==="
    python3 "$DIR/services/tts_runner.py" &
    TTS_PID=$!
fi

if [ "$MODE" = "all" ] || [ "$MODE" = "llama" ]; then
    echo "=== Starting Llama Server on :8081 ==="
    python3 "$DIR/services/llama_server.py" &
    LLAMA_PID=$!
fi

echo "=== Services started ==="
echo "  Llama: http://127.0.0.1:8081"
echo "  TTS:   http://127.0.0.1:8082"
echo "Press Ctrl+C to stop"

trap "kill $TTS_PID $LLAMA_PID 2>/dev/null; exit" INT TERM
wait
