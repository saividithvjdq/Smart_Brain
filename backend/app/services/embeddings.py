"""
Embedding Service — Convert text into vector representations.

📚 LEARNING:
    An "embedding" converts text into a list of numbers (a vector)
    that captures the text's MEANING. Similar texts get similar vectors.

    Example:
        "How to cook pasta" → [0.23, -0.45, 0.82, ...]
        "Italian recipe"    → [0.21, -0.42, 0.80, ...]  ← similar!
        "Python variables"  → [0.91, 0.12, -0.67, ...]  ← very different

    We use Gemini's free embedding model (text-embedding-004).
"""

import google.generativeai as genai
from app.config import settings

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        genai.configure(api_key=settings.google_ai_api_key)
        _configured = True


async def generate_embedding(text: str) -> list[float]:
    """
    Convert text into a 768-dimensional vector embedding.

    📚 LEARNING:
        The resulting vector has 768 numbers.
        We store these in a vector database (ChromaDB)
        and use cosine similarity to find similar items.
    """
    _ensure_configured()
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
    )
    return result["embedding"]
