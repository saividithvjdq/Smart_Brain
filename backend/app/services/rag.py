"""
RAG Engine — Retrieval Augmented Generation with User Context.

📚 LEARNING:
    RAG = Retrieve relevant context + Generate answer using that context.

    Flow:
    1. User asks: "What did I learn about React?"
    2. RETRIEVE: Search vector DB with the question text → get top 5 matching notes
    3. AUGMENT: Format those notes + user context as context for the LLM
    4. GENERATE: LLM answers using ONLY the retrieved context

    User Context:
    The user's profile (interests, role, goals) is injected into the system
    prompt so the AI gives personalized, tailored answers.
"""

import json
import re
from app.services.llm import llm_service
from app.db.vector_store import vector_store
from app.db.firebase import firebase_db


BASE_SYSTEM_PROMPT = """You are the user's Second Brain assistant called Axon.
You help them recall and connect their knowledge.

RULES:
1. Answer ONLY using the provided notes as context
2. If the notes don't contain relevant information, say "I don't have notes about that"
3. Quote note titles as sources when referencing information
4. Be concise but thorough
5. Make connections between related notes when relevant"""


class RAGEngine:
    """Core RAG pipeline: search → retrieve → generate (with user context)."""

    def _build_system_prompt(self, user_context_str: str = "") -> str:
        """Build system prompt with optional user context."""
        prompt = BASE_SYSTEM_PROMPT
        if user_context_str:
            prompt += f"\n\nUSER PROFILE: {user_context_str}\nTailor your response style and focus areas based on this profile."
        return prompt

    async def query(self, question: str, user_id: str) -> dict:
        """Full RAG pipeline with user context injection."""

        # Step 0: Fetch user context for personalized responses
        user_context = await firebase_db.get_user_context(user_id)
        user_context_str = user_context.to_prompt()

        # Step 1: Search vector store with question text
        results = vector_store.search(question, user_id, n_results=5)

        if not results:
            return {
                "answer": "I don't have any notes that could help answer this. Try adding some knowledge items first!",
                "sources": [],
            }

        # Step 2: Fetch full note content from Firebase
        sources = []
        context_parts = []
        for i, result in enumerate(results):
            note = await firebase_db.get_knowledge_item_by_id(result["id"])
            if note:
                sources.append({
                    "id": note["id"],
                    "title": note["title"],
                    "type": note["type"],
                    "summary": note.get("summary"),
                })
                summary = note.get("summary") or note["content"][:500]
                tags = note.get("tags", [])
                tag_str = f" [Tags: {', '.join(tags)}]" if tags else ""
                context_parts.append(
                    f'--- Note {i + 1}: "{note["title"]}"{tag_str} ---\n{summary}'
                )

        context_str = "\n\n".join(context_parts)

        # Step 3: Generate answer with user-personalized system prompt
        system_prompt = self._build_system_prompt(user_context_str)

        prompt = f"""CONTEXT (User's Notes):
{context_str}

USER QUESTION: {question}

Answer using ONLY the context above. Cite sources by title."""

        answer = await llm_service.generate(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.5,
            max_tokens=1024,
        )

        return {"answer": answer, "sources": sources}

    async def summarize(self, content: str) -> str:
        """Generate a concise summary of content."""
        prompt = (
            "Summarize the following content in 2-3 concise sentences. "
            "Focus on key insights and actionable points.\n\n"
            f"CONTENT:\n{content}\n\nSUMMARY:"
        )
        return await llm_service.generate(prompt, temperature=0.3, max_tokens=256)

    async def auto_tag(self, title: str, content: str) -> list[str]:
        """Generate relevant tags for content."""
        prompt = (
            "Generate 3-5 relevant tags for this knowledge item. "
            "Return ONLY a JSON array of lowercase tags.\n\n"
            f"TITLE: {title}\n"
            f"CONTENT: {content[:1000]}\n\n"
            "TAGS (JSON array only):"
        )
        response = await llm_service.generate(prompt, temperature=0.3, max_tokens=100)

        try:
            match = re.search(r"\[.*\]", response)
            if match:
                return json.loads(match.group())
        except Exception:
            print(f"Failed to parse tags: {response}")

        return []


# ── Singleton ──────────────────────────────────────────────────
rag_engine = RAGEngine()
