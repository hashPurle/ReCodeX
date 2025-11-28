from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"


class ChatRequest(BaseModel):
    message: str
    context: dict = {}


@router.post('/chat')
async def chat_endpoint(req: ChatRequest):
    if not req.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        prompt = f"You are a helpful assistant. \nUser question: {req.message}\nContext: {req.context}\nRespond concisely and clearly."
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(OLLAMA_URL, json={"model": MODEL_NAME, "prompt": prompt, "stream": False})
            if response.status_code == 200:
                data = response.json()
                reply = data.get('response', '')
                return { 'reply': reply }
            else:
                raise HTTPException(status_code=502, detail=f"Ollama error: {response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
