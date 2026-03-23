"""
Public Router — Rate-limited public API for querying the brain.

📚 LEARNING:
    This endpoint is public (no auth required).
    Rate limiting prevents abuse.
"""

from fastapi import APIRouter, Query, Request, HTTPException
from datetime import datetime
from app.models.chat import PublicQueryResponse
from app.services.rag import rag_engine
from app.middleware.rate_limit import check_rate_limit

router = APIRouter(prefix="/public", tags=["Public API"])


@router.get("/brain/query", response_model=PublicQueryResponse)
async def public_query(
    request: Request,
    q: str = Query(..., min_length=3, max_length=500, description="Your question"),
):
    """
    Public API — query the knowledge base without authentication.

    Usage: GET /public/brain/query?q=your question here
    """
    # Rate limit by IP
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")

    user_id = "public-demo"
    result = await rag_engine.query(q, user_id)

    return PublicQueryResponse(
        answer=result["answer"],
        sources=result.get("sources", []),
        meta={
            "query": q,
            "timestamp": datetime.utcnow().isoformat(),
            "source_count": len(result.get("sources", [])),
        },
    )
