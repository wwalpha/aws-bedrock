from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.models.schema import ChatRequest, ChatResponse
from app.services.chat_logic import get_chat_response, stream_chat_response

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
  return await get_chat_response(request)


@router.get("/stream")
async def chat_stream(request: Request, message: str):
  async def event_generator():
    async for token in stream_chat_response(message):
      yield f"data: {token}\n\n"

  return StreamingResponse(event_generator(), media_type="text/event-stream")
