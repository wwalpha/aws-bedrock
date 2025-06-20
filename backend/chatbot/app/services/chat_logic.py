from typing import AsyncGenerator
from app.models.schema import ChatRequest, ChatResponse
from app.core.llm import chat_model
from langchain.schema import HumanMessage


async def get_chat_response(req: ChatRequest) -> ChatResponse:
  response = await chat_model.ainvoke([HumanMessage(content=req.message)])
  return ChatResponse(response=response.content)


async def stream_chat_response(message: str) -> AsyncGenerator[str, None]:
  response_stream = chat_model.stream([HumanMessage(content=message)])
  async for chunk in response_stream:
    yield chunk.content
