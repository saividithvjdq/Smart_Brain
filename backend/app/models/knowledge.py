"""
Knowledge Item Models — Pydantic schemas for request/response validation.

📚 LEARNING:
    Pydantic models work like Zod schemas in TypeScript.
    They validate data automatically — if a required field is missing
    or has the wrong type, FastAPI returns a 422 error with details.

    Field(...) means "required"
    Field(default=...) means "optional with default"
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ItemType(str, Enum):
    """Knowledge item types — behaves like a union type in TypeScript."""
    note = "note"
    link = "link"
    insight = "insight"


# ── Request Models (what the client sends) ─────────────────────

class KnowledgeItemCreate(BaseModel):
    """POST /knowledge — create a new knowledge item."""
    title: str = Field(..., min_length=1, max_length=200, description="Title of the item")
    content: str = Field(..., min_length=1, description="Main content body")
    type: ItemType = Field(..., description="Type: note, link, or insight")
    source_url: Optional[str] = Field(None, description="Source URL for links")
    tags: list[str] = Field(default_factory=list, description="Tags for categorization")


class KnowledgeItemUpdate(BaseModel):
    """PATCH /knowledge/{id} — update an existing item."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    type: Optional[ItemType] = None
    source_url: Optional[str] = None
    tags: Optional[list[str]] = None
    summary: Optional[str] = None


class KnowledgeItemFilter(BaseModel):
    """Query parameters for filtering knowledge items."""
    type: Optional[ItemType] = None
    tags: Optional[list[str]] = None
    search: Optional[str] = None
    limit: int = Field(50, ge=1, le=200)
    offset: int = Field(0, ge=0)


# ── Response Models (what the API returns) ─────────────────────

class KnowledgeItemResponse(BaseModel):
    """Full knowledge item as returned by the API."""
    id: str
    user_id: str
    title: str
    content: str
    type: ItemType
    source_url: Optional[str] = None
    tags: list[str] = []
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class KnowledgeListResponse(BaseModel):
    """Paginated list of knowledge items."""
    items: list[KnowledgeItemResponse]
    count: int


class SummarizeRequest(BaseModel):
    """POST /ai/summarize"""
    content: str = Field(..., min_length=10, description="Content to summarize")


class SummarizeResponse(BaseModel):
    summary: str


class AutoTagRequest(BaseModel):
    """POST /ai/auto-tag"""
    title: Optional[str] = Field(None, description="Title of the item")
    content: str = Field(..., min_length=10, description="Content to generate tags for")


class AutoTagResponse(BaseModel):
    tags: list[str]
