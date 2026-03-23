"""
LLM Provider Service — Abstraction over multiple AI providers.

📚 LEARNING:
    This is the "Strategy Pattern" — one interface, multiple implementations.
    You call `llm_service.generate(prompt)` and it routes to Groq or Gemini
    based on the provider argument. This makes it easy to swap providers.

    Groq (LLaMA 3.3 70B) = faster, good for most tasks
    Gemini (1.5 Flash) = larger context window, good for long documents
"""

from groq import AsyncGroq
import google.generativeai as genai
from app.config import settings


class LLMService:
    """Unified interface for AI text generation."""

    def __init__(self):
        self._groq: AsyncGroq | None = None
        self._gemini_configured = False

    def _get_groq(self) -> AsyncGroq:
        """Lazy-init Groq client (created only when first needed)."""
        if not self._groq:
            if not settings.groq_api_key:
                raise ValueError("GROQ_API_KEY is not set in .env")
            self._groq = AsyncGroq(api_key=settings.groq_api_key)
        return self._groq

    def _ensure_gemini(self):
        """Lazy-init Gemini configuration."""
        if not self._gemini_configured:
            if not settings.google_ai_api_key:
                raise ValueError("GOOGLE_AI_API_KEY is not set in .env")
            genai.configure(api_key=settings.google_ai_api_key)
            self._gemini_configured = True

    async def generate(
        self,
        prompt: str,
        provider: str = "groq",
        system_prompt: str = "You are a helpful assistant.",
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """
        Generate text using the specified provider.

        📚 LEARNING:
            `async def` = this function is asynchronous (non-blocking).
            `await` = pause here until the API response comes back,
            but let other requests be handled while waiting.
            This is why FastAPI can handle many concurrent requests.
        """
        if provider == "groq":
            client = self._get_groq()
            response = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content or ""

        # Gemini fallback
        self._ensure_gemini()
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"{system_prompt}\n\n{prompt}",
            generation_config=genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            ),
        )
        return response.text

    async def stream(
        self,
        prompt: str,
        provider: str = "groq",
        system_prompt: str = "You are a helpful assistant.",
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ):
        """
        Stream text generation token by token.

        📚 LEARNING:
            `async for` iterates over an async generator.
            Each `yield` sends one chunk to the caller.
            This enables real-time streaming like ChatGPT.
        """
        if provider == "groq":
            client = self._get_groq()
            stream = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )
            async for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content


# ── Singleton ──────────────────────────────────────────────────
llm_service = LLMService()
