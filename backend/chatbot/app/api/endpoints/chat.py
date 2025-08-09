from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from app.models.schema import ChatRequest, ChatResponse
from app.services.chat_logic import get_chat_history, get_chat_response, save_message_to_history, stream_chat_response

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
  return await get_chat_response(request)


@router.get("/chat/stream")
async def chat_stream(request: Request, session_id: str, message: str):
  # ユーザーからのメッセージを保存
  save_message_to_history(session_id=request.session_id, role="user", content=request.message)

  # ストリーム全体を結合するためのリスト
  bot_response_parts = []

  async def event_generator():
    async for token in stream_chat_response(message):
       # 各トークンをリストに追加
      bot_response_parts.append(token)
      yield f"data: {token}\n\n"

  # ストリーム終了後に履歴を保存
  async def finalize_response():
    bot_response = "".join(bot_response_parts)  # トークンを結合して完全な応答を作成
    save_message_to_history(session_id=session_id, role="bot", content=bot_response)

  # ストリーミングレスポンスを返しつつ、終了後に履歴を保存
  response = StreamingResponse(event_generator(), media_type="text/event-stream")
  response.background = finalize_response()  # 背景タスクとして履歴保存を実行

  return response


@router.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    # DynamoDB からチャット履歴を取得
  history = get_chat_history(session_id)
  return JSONResponse(content={"history": [msg.dict() for msg in history]})
