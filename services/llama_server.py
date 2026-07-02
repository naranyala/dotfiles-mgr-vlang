import os
import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ⚠️ RULE: Avoid big stacks. Avoid big dependencies. Pick the tiny solution if possible.
# If this can be done with stdlib, don't add a package.

app = FastAPI(title="Llama Server")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

llm = None
current_model_name = ""
models_dir = os.environ.get("LLAMA_MODELS_DIR", os.path.expanduser("~/.cache/llama-models"))


class LoadRequest(BaseModel):
    model_path: str


class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 512


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": llm is not None,
        "model": current_model_name,
    }


@app.get("/models")
def list_models():
    models = []
    if os.path.isdir(models_dir):
        for f in Path(models_dir).glob("*.gguf"):
            stat = f.stat()
            models.append({
                "path": str(f),
                "name": f.stem,
                "size_mb": round(stat.st_size / (1024 * 1024), 1),
            })
    return {"models": models}


@app.post("/load")
def load_model(req: LoadRequest):
    global llm, current_model_name
    try:
        from llama_cpp import Llama
        if not req.model_path or not os.path.exists(req.model_path):
            return {"ok": False, "error": f"Model not found: {req.model_path}"}
        llm = Llama(model_path=req.model_path, n_ctx=2048, n_threads=4, verbose=False)
        current_model_name = os.path.basename(req.model_path)
        return {"ok": True, "model": current_model_name, "error": None}
    except Exception as e:
        return {"ok": False, "model": None, "error": str(e)}


@app.post("/unload")
def unload_model():
    global llm, current_model_name
    llm = None
    current_model_name = ""
    return {"ok": True}


@app.post("/generate")
def generate(req: GenerateRequest):
    if llm is None:
        return {"text": None, "error": "No model loaded"}
    try:
        output = llm(req.prompt, max_tokens=req.max_tokens, stop=["</s>"])
        text = output["choices"][0]["text"]
        return {"text": text, "error": None}
    except Exception as e:
        return {"text": None, "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8081)
