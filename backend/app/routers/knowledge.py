"""
Knowledge Router — CRUD endpoints for knowledge items.

📚 LEARNING:
    REST API pattern:
    GET    /knowledge        → List items (with filters)
    POST   /knowledge        → Create new item
    GET    /knowledge/{id}   → Get single item
    PATCH  /knowledge/{id}   → Update item
    DELETE /knowledge/{id}   → Delete item
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.models.knowledge import (
    KnowledgeItemCreate,
    KnowledgeItemResponse,
    KnowledgeListResponse,
)
from app.middleware.auth import get_current_user
from app.db.firebase import firebase_db
from app.services.rag import rag_engine

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.get("/", response_model=KnowledgeListResponse)
async def list_items(
    user_id: str = Depends(get_current_user),
    type: Optional[str] = Query(None, description="Filter by type: note, link, insight"),
    search: Optional[str] = Query(None, description="Text search query"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    limit: int = Query(50, ge=1, le=200),
):
    """List all knowledge items for the current user."""
    tag_list = tags.split(",") if tags else None
    items = await firebase_db.get_knowledge_items(
        user_id, type=type, search=search, tags=tag_list, limit=limit,
    )
    return KnowledgeListResponse(items=items, count=len(items))


@router.post("/", response_model=KnowledgeItemResponse, status_code=202)
async def create_item(
    item: KnowledgeItemCreate,
    user_id: str = Depends(get_current_user),
):
    """Create a new knowledge item. Generates summary + embedding for RAG."""
    from app.db.vector_store import vector_store

    created = await firebase_db.create_knowledge_item(user_id, item.model_dump())

    # AI processing: summary + vector indexing for search
    try:
        # Generate summary via LLM
        summary = await rag_engine.summarize(item.content)
        await firebase_db.update_knowledge_item(created["id"], {"summary": summary})
        created["summary"] = summary

        # Store in ChromaDB for RAG (ChromaDB auto-embeds the text)
        text_to_index = f"{item.title}\n{item.content}"
        vector_store.add_item(
            item_id=created["id"],
            text=text_to_index,
            metadata={
                "user_id": user_id,
                "title": item.title,
                "type": item.type.value,
                "tags": ",".join(item.tags) if item.tags else "",
            },
        )
        print(f"✅ Item '{item.title}' stored in Firestore + ChromaDB")
    except Exception as e:
        print(f"⚠️ Background processing failed: {e}")

    return KnowledgeItemResponse(**created)


@router.get("/{item_id}", response_model=KnowledgeItemResponse)
async def get_item(
    item_id: str,
    user_id: str = Depends(get_current_user),
):
    """Get a single knowledge item by ID."""
    item = await firebase_db.get_knowledge_item(user_id, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return KnowledgeItemResponse(**item)


@router.delete("/{item_id}")
async def delete_item(
    item_id: str,
    user_id: str = Depends(get_current_user),
):
    """Delete a knowledge item."""
    deleted = await firebase_db.delete_knowledge_item(user_id, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}
