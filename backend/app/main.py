"""
Axon Second Brain — FastAPI Backend
====================================
Production-grade AI backend with RAG, MCP, and vector search.

Run with:
    uvicorn app.main:app --reload --port 8000

API Docs at: http://localhost:8000/docs
"""

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import ai, knowledge, public
from app.db.vector_store import vector_store
from app.db.firebase import firebase_db
from app.middleware.auth import get_current_user
from app.models.user import UserContext, UserContextUpdate


# ── Startup / Shutdown ─────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    📚 LEARNING:
        Lifespan events run code on startup and shutdown.
        On startup: re-index all Firestore items → ChromaDB
        so semantic search works immediately, even after restarts.
    """
    # ── Startup ──
    print("🚀 Axon Backend starting...")
    try:
        items = await firebase_db.get_all_knowledge_items()
        if items:
            vector_store.reindex_all(items)
            print(f"✅ Re-indexed {len(items)} items from Firestore → ChromaDB")
        else:
            print("📭 No items in Firestore yet — ChromaDB empty")
    except Exception as e:
        print(f"⚠️ Startup re-index failed (non-fatal): {e}")

    yield

    # ── Shutdown ──
    print("👋 Axon Backend shutting down")


# ── Create FastAPI App ──────────────────────────────────────────
app = FastAPI(
    title="Axon Second Brain API",
    description="AI-powered knowledge management backend with RAG, semantic search, and user context",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS Middleware ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ───────────────────────────────────────────
app.include_router(ai.router)
app.include_router(knowledge.router)
app.include_router(public.router)


# ── User Context API ───────────────────────────────────────────
@app.get("/user/context", tags=["User Context"])
async def get_user_context(user_id: str = Depends(get_current_user)):
    """Get the current user's AI personalization profile."""
    context = await firebase_db.get_user_context(user_id)
    return context.model_dump()


@app.put("/user/context", tags=["User Context"])
async def update_user_context(
    update: UserContextUpdate,
    user_id: str = Depends(get_current_user),
):
    """Update the user's AI personalization profile."""
    data = {k: v for k, v in update.model_dump().items() if v is not None}
    await firebase_db.save_user_context(user_id, data)
    context = await firebase_db.get_user_context(user_id)
    return {"message": "Context updated", "context": context.model_dump()}


# ── Health Check ───────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    """Check if the API is running."""
    return {
        "status": "ok",
        "service": "axon-brain",
        "version": "1.0.0",
        "vector_store_count": vector_store.count(),
    }


@app.get("/", tags=["System"])
async def root():
    """Welcome endpoint with API docs link."""
    return {
        "message": "Axon Second Brain API",
        "docs": "/docs",
        "health": "/health",
    }
