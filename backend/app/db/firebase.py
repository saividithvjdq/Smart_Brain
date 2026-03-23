"""
Firebase Database — Python Firebase Admin SDK wrapper.

📚 LEARNING:
    This mirrors your TypeScript firestore.ts but in Python.
    Firebase Admin SDK authenticates using a service account key,
    NOT the client-side API key. This runs server-side only.
"""

import json
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1 import FieldFilter
from datetime import datetime, timezone
from app.config import settings
from app.models.user import UserContext


class FirebaseDB:
    """Firebase Firestore operations for knowledge items."""

    def __init__(self):
        self._db = None

    def _get_db(self):
        """Lazy-initialize Firebase Admin SDK."""
        if self._db is None:
            if not firebase_admin._apps:
                if settings.firebase_service_account_key:
                    cred_dict = json.loads(settings.firebase_service_account_key)
                    cred = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred)
                else:
                    # Use default credentials (for Cloud Run / GCP)
                    firebase_admin.initialize_app()
            self._db = firestore.client()
        return self._db

    async def create_knowledge_item(self, user_id: str, item: dict) -> dict:
        """Create a new knowledge item in Firestore."""
        db = self._get_db()
        now = datetime.now(timezone.utc)

        doc_data = {
            "userId": user_id,
            "title": item["title"],
            "content": item["content"],
            "type": item["type"],
            "sourceUrl": item.get("source_url"),
            "tags": item.get("tags", []),
            "summary": None,
            "createdAt": now,
            "updatedAt": now,
        }

        doc_ref = db.collection("knowledge_items").add(doc_data)[1]
        doc = doc_ref.get()

        return self._format_item(doc)

    async def get_knowledge_items(
        self,
        user_id: str,
        type: str = None,
        search: str = None,
        tags: list[str] = None,
        limit: int = 50,
    ) -> list[dict]:
        """List knowledge items with optional filters."""
        db = self._get_db()

        query = (
            db.collection("knowledge_items")
            .where(filter=FieldFilter("userId", "==", user_id))
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .limit(limit)
        )

        if type:
            query = query.where(filter=FieldFilter("type", "==", type))

        docs = query.stream()
        items = [self._format_item(doc) for doc in docs]

        # Client-side text search (Firestore doesn't support full-text natively)
        if search:
            search_lower = search.lower()
            items = [
                item for item in items
                if search_lower in item["title"].lower()
                or search_lower in item["content"].lower()
            ]

        # Client-side tag filter
        if tags:
            items = [
                item for item in items
                if any(tag in item["tags"] for tag in tags)
            ]

        return items

    async def get_knowledge_item(self, user_id: str, item_id: str) -> dict | None:
        """Get a single item, verifying ownership."""
        db = self._get_db()
        doc = db.collection("knowledge_items").document(item_id).get()

        if not doc.exists:
            return None

        data = doc.to_dict()
        if data.get("userId") != user_id:
            return None  # Security: only owner can read

        return self._format_item(doc)

    async def get_knowledge_item_by_id(self, item_id: str) -> dict | None:
        """Get item by ID without ownership check (for RAG internal use)."""
        db = self._get_db()
        doc = db.collection("knowledge_items").document(item_id).get()
        if not doc.exists:
            return None
        return self._format_item(doc)

    async def update_knowledge_item(self, item_id: str, data: dict):
        """Update a knowledge item."""
        db = self._get_db()
        data["updatedAt"] = datetime.now(timezone.utc)
        db.collection("knowledge_items").document(item_id).update(data)

    async def delete_knowledge_item(self, user_id: str, item_id: str) -> bool:
        """Delete a knowledge item (with ownership check)."""
        db = self._get_db()
        doc = db.collection("knowledge_items").document(item_id).get()

        if not doc.exists:
            return False
        if doc.to_dict().get("userId") != user_id:
            return False

        db.collection("knowledge_items").document(item_id).delete()
        return True

    # ── User Context ───────────────────────────────────────────

    async def get_user_context(self, user_id: str) -> UserContext:
        """Get the user's AI context profile."""
        db = self._get_db()
        doc = db.collection("user_profiles").document(user_id).get()
        if doc.exists:
            data = doc.to_dict()
            return UserContext(
                interests=data.get("interests", []),
                role=data.get("role", ""),
                style=data.get("style", "concise"),
                goals=data.get("goals", ""),
            )
        return UserContext()

    async def save_user_context(self, user_id: str, context: dict):
        """Save/update the user's AI context profile."""
        db = self._get_db()
        context["updatedAt"] = datetime.now(timezone.utc)
        db.collection("user_profiles").document(user_id).set(context, merge=True)

    # ── Batch Operations ───────────────────────────────────────

    async def get_all_knowledge_items(self) -> list[dict]:
        """Get ALL knowledge items (for re-indexing ChromaDB on startup)."""
        db = self._get_db()
        docs = db.collection("knowledge_items").stream()
        return [self._format_item(doc) for doc in docs]

    def _format_item(self, doc) -> dict:
        """Convert Firestore document to API response format."""
        data = doc.to_dict()
        created_at = data.get("createdAt")
        updated_at = data.get("updatedAt")

        return {
            "id": doc.id,
            "user_id": data.get("userId", ""),
            "title": data.get("title", ""),
            "content": data.get("content", ""),
            "type": data.get("type", "note"),
            "source_url": data.get("sourceUrl"),
            "tags": data.get("tags", []),
            "summary": data.get("summary"),
            "created_at": created_at.isoformat() if created_at else datetime.now(timezone.utc).isoformat(),
            "updated_at": updated_at.isoformat() if updated_at else datetime.now(timezone.utc).isoformat(),
        }


# ── Singleton ──────────────────────────────────────────────────
firebase_db = FirebaseDB()
