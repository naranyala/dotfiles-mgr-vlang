#!/usr/bin/env python3
"""
Bare minimum runner for llama-server and tts-runner.
Starts both services on ports 8081 and 8082.
"""
import sys
import uvicorn

BANNER = """
╔══════════════════════════════════════════════════╗
║  ⚠️  RULE: Avoid big stacks.                    ║
║  Avoid big dependencies.                         ║
║  Pick the tiny solution if possible.             ║
╚══════════════════════════════════════════════════╝
"""

def main():
    print(BANNER)
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"

    if mode in ("llama", "all"):
        from llama_server import app as llama_app
        print("[llama-server] Starting on http://127.0.0.1:8081")
        uvicorn.run(llama_app, host="127.0.0.1", port=8081)

    if mode in ("tts", "all"):
        from tts_runner import app as tts_app
        print("[tts-runner] Starting on http://127.0.0.1:8082")
        uvicorn.run(tts_app, host="127.0.0.1", port=8082)


if __name__ == "__main__":
    main()
