"""
Chat Models — Request/Response schemas for AI query endpoints.

📚 LEARNING:
    These models define the shape of data flowing through the chat/query APIs.
    FastAPI uses these to:
    1. Validate incoming JSON automatically
    2. Generate OpenAPI docs (visible at /docs)
    3. Provide type hints for your IDE
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class QueryRequest(BaseModel):
    """POST /ai/query — ask a question to your knowledge base."""
    question: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="Question to ask your second brain",
    )


class SourceItem(BaseModel):
    """A source note that was used to generate the answer."""
    id: str
    title: str
    type: str
    summary: Optional[str] = None


class QueryResponse(BaseModel):
    """Response from the RAG query endpoint."""
    answer: str
    sources: list[SourceItem]
    tool_used: Optional[str] = None  # MCP: which tool handled this


class ChatMessage(BaseModel):
    """A single message in a chat session."""
    id: str
    role: str  # "user" or "assistant"
    content: str
    sources: Optional[list[SourceItem]] = None
    created_at: datetime


class ChatSession(BaseModel):
    """A full chat conversation."""
    id: str
    user_id: str
    messages: list[ChatMessage]
    created_at: datetime
    updated_at: datetime


class PublicQueryResponse(BaseModel):
    """Response from the public API endpoint."""
    answer: str
    sources: list[SourceItem]
    meta: dict
