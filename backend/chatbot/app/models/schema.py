from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    model_id: str | None = None  # optional override


class ChatResponse(BaseModel):
    response: str
