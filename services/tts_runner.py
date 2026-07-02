import os
import uuid
import asyncio
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

# ⚠️ RULE: Avoid big stacks. Avoid big dependencies. Pick the tiny solution if possible.
# If this can be done with stdlib, don't add a package.

app = FastAPI(title="TTS Runner")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

audio_dir = Path(os.environ.get("TTS_AUDIO_DIR", "/tmp/tts-output"))
audio_dir.mkdir(parents=True, exist_ok=True)


class SpeakRequest(BaseModel):
    text: str
    voice: str = "en-US-AriaNeural"
    rate: str = "+0%"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/voices")
async def list_voices():
    import edge_tts
    voices = await edge_tts.list_voices()
    return {"voices": voices}


@app.post("/speak")
async def speak(req: SpeakRequest):
    try:
        import edge_tts
        filename = f"{uuid.uuid4().hex[:12]}.mp3"
        filepath = audio_dir / filename
        communicate = edge_tts.Communicate(req.text, req.voice, rate=req.rate)
        await communicate.save(str(filepath))
        return {"ok": True, "file": filename, "error": None}
    except Exception as e:
        return {"ok": False, "file": None, "error": str(e)}


@app.get("/audio/{filename}")
def serve_audio(filename: str):
    filepath = audio_dir / filename
    if not filepath.exists():
        return {"error": "File not found"}
    return FileResponse(str(filepath), media_type="audio/mpeg")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8082)
