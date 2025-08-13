from typing import AsyncGenerator
from app.models.schema import ChatRequest, ChatResponse
from app.core.llm import ainvoke_with_model, stream_with_model, BEDROCK_MODEL_ID
from langchain_core.messages import HumanMessage
import os


TABLE_NAME = "bedrock_chat_history"  # TODO: align with backend/api table names
chat_history_store: dict[str, list[dict]] = {}


async def get_chat_response(req: ChatRequest) -> ChatResponse:
    model_id = req.model_id or BEDROCK_MODEL_ID
    response = await ainvoke_with_model(model_id, [HumanMessage(content=req.message)])
    return ChatResponse(response=response.content)


async def stream_chat_response(message: str, model_id: str | None = None) -> AsyncGenerator[str, None]:
    mid = model_id or BEDROCK_MODEL_ID
    response_stream = stream_with_model(mid, [HumanMessage(content=message)])
    for chunk in response_stream:
        yield getattr(chunk, 'content', '')


def save_message_to_history(session_id: str, role: str, content: str):
    """チャット履歴を DynamoDB に保存"""
    session_msgs = chat_history_store.setdefault(session_id, [])
    session_msgs.append({"role": role, "content": content})


def get_chat_history(session_id: str):
    """DynamoDB からチャット履歴を取得"""
    return chat_history_store.get(session_id, [])
