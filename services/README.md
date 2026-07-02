# Services

Bare minimum Python services for llama-server and TTS runner.

## ⚠️ Design Rule

**Avoid big stacks. Avoid big dependencies. Pick the tiny solution if possible.**

- Prefer stdlib over third-party packages
- If a single `pip install` can be replaced by 20 lines of stdlib code, write the 20 lines
- Only add a dependency when the benefit clearly outweighs the weight
- Keep each service in a single file
- No abstractions, no frameworks beyond what's strictly needed

## Quick Start

```bash
pip install -r requirements.txt
bash ../services.sh
```

## Endpoints

### Llama Server (:8081)
- `GET /health` — server status
- `GET /models` — list GGUF models from `~/.cache/llama-models/`
- `POST /load` — load a model
- `POST /unload` — release model
- `POST /generate` — text completion

### TTS Runner (:8082)
- `GET /health` — server status
- `GET /voices` — list available voices
- `POST /speak` — generate speech audio
- `GET /audio/{file}` — serve generated MP3
