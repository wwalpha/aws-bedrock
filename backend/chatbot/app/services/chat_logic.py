from typing import AsyncGenerator
from app.models.schema import ChatRequest, ChatResponse
from app.core.llm import chat_model
from langchain.schema import HumanMessage
from langchain_community.chat_message_histories import DynamoDBChatMessageHistory
from langchain.schema import ChatMessage
import os


TABLE_NAME = "bedrock_chat_history"

# DynamoDBChatMessageHistory の初期化
chat_history = DynamoDBChatMessageHistory(
    table_name=TABLE_NAME,
    session_id="default_session",
    region_name=os.getenv("AWS_REGION", "ap-northeast-1")
)


async def get_chat_response(req: ChatRequest) -> ChatResponse:
  response = await chat_model.ainvoke([HumanMessage(content=req.message)])
  return ChatResponse(response=response.content)


async def stream_chat_response(message: str) -> AsyncGenerator[str, None]:
  response_stream = chat_model.stream([HumanMessage(content=message)])
  for chunk in response_stream:
    yield chunk.content


def save_message_to_history(session_id: str, role: str, content: str):
  """チャット履歴を DynamoDB に保存"""
  chat_history.session_id = session_id
  message = ChatMessage(role=role, content=content)
  chat_history.add_message(message)


def get_chat_history(session_id: str):
  """DynamoDB からチャット履歴を取得"""
  chat_history.session_id = session_id
  return chat_history.get_messages()
