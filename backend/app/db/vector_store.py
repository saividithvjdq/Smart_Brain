"""
Vector Store — ChromaDB for semantic search.

📚 LEARNING:
    ChromaDB is an open-source vector database that runs locally.
    It stores embeddings (vectors) and lets you search by similarity.

    This version uses ChromaDB's built-in embedding function,
    which runs the `all-MiniLM-L6-v2` model locally. No API key needed!
    
    On each server startup, all knowledge items are re-indexed from
    Firestore into ChromaDB so search is always up-to-date.
"""

import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"

import chromadb
from app.config import settings


class VectorStore:
    """ChromaDB wrapper for storing and searching knowledge items."""

    def __init__(self):
        self._client = None
        self._collection = None

    def _get_collection(self):
        """Lazy-initialize ChromaDB."""
        if self._collection is None:
            self._client = chromadb.Client()
            
            self._collection = self._client.get_or_create_collection(
                name="knowledge_items",
                metadata={"hnsw:space": "cosine"},
            )
        return self._collection

    def add_item(self, item_id: str, text: str, metadata: dict):
        """
        Store a knowledge item — ChromaDB generates the embedding automatically.
        """
        collection = self._get_collection()
        collection.upsert(
            ids=[item_id],
            documents=[text],
            metadatas=[metadata],
        )

    def search(self, query: str, user_id: str, n_results: int = 5) -> list[dict]:
        """
        Find the most similar items to a query text.
        Only returns items with similarity score above 0.3 threshold.
        """
        collection = self._get_collection()

        try:
            results = collection.query(
                query_texts=[query],
                n_results=n_results,
                where={"user_id": user_id},
            )
        except Exception:
            return []

        if not results["ids"] or not results["ids"][0]:
            return []

        items = []
        for id_, dist, meta in zip(
            results["ids"][0],
            results["distances"][0],
            results["metadatas"][0],
        ):
            score = 1 - dist
            if score > 0.3:  # Threshold: skip weak matches
                items.append({"id": id_, "score": score, "metadata": meta})
        return items

    def delete_item(self, item_id: str):
        """Remove an item from the vector store."""
        collection = self._get_collection()
        try:
            collection.delete(ids=[item_id])
        except Exception:
            pass

    def count(self) -> int:
        """Return number of items in the vector store."""
        return self._get_collection().count()

    def reindex_all(self, items: list[dict]):
        """
        Re-index all items from Firestore into ChromaDB.
        Called on startup to ensure search is always available.
        """
        collection = self._get_collection()
        
        if not items:
            print("  No items to index")
            return

        ids = []
        documents = []
        metadatas = []

        for item in items:
            text = f"{item['title']}\n{item['content']}"
            ids.append(item["id"])
            documents.append(text)
            metadatas.append({
                "user_id": item.get("user_id", ""),
                "title": item["title"],
                "type": item.get("type", "note"),
                "tags": ",".join(item.get("tags", [])),
            })

        # Upsert in batches of 100
        batch_size = 100
        for i in range(0, len(ids), batch_size):
            collection.upsert(
                ids=ids[i:i + batch_size],
                documents=documents[i:i + batch_size],
                metadatas=metadatas[i:i + batch_size],
            )

        print(f"  Indexed {len(ids)} items into ChromaDB")


# ── Singleton ──────────────────────────────────────────────────
vector_store = VectorStore()
