"""
AI Router — Endpoints for summarization, auto-tagging, and RAG queries.

📚 LEARNING:
    APIRouter is like Express Router in Node.js.
    It groups related endpoints under a prefix and tag.
    Depends() is FastAPI's dependency injection — it runs middleware
    functions (like auth checking) before your endpoint code.
"""

from fastapi import APIRouter, Depends
from app.models.knowledge import SummarizeRequest, SummarizeResponse, AutoTagRequest, AutoTagResponse
from app.models.chat import QueryRequest, QueryResponse
from app.middleware.auth import get_current_user
from app.services.rag import rag_engine

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(req: SummarizeRequest):
    """
    Generate an AI summary of the provided content.

    📚 LEARNING:
        - `req: SummarizeRequest` — FastAPI auto-parses the JSON body
          and validates it against the Pydantic model.
        - `response_model=SummarizeResponse` — FastAPI auto-serializes
          the return value and validates the response shape.
    """
    summary = await rag_engine.summarize(req.content)
    return SummarizeResponse(summary=summary)


@router.post("/auto-tag", response_model=AutoTagResponse)
async def auto_tag(req: AutoTagRequest):
    """Generate AI-powered tags for the given content."""
    tags = await rag_engine.auto_tag(req.title or "", req.content)
    return AutoTagResponse(tags=tags)


@router.post("/query", response_model=QueryResponse)
async def query_brain(
    req: QueryRequest,
    user_id: str = Depends(get_current_user),
):
    """
    Ask a question to your knowledge base using RAG.

    📚 LEARNING:
        `user_id: str = Depends(get_current_user)` means:
        1. Before running this function, call `get_current_user()`
        2. It checks the Authorization header for a valid Firebase token
        3. If valid, it returns the user_id and injects it here
        4. If invalid, it automatically returns 401 Unauthorized
    """
    result = await rag_engine.query(req.question, user_id)
    return QueryResponse(**result)
