"""
Configuration — Type-safe environment variables using Pydantic Settings.

📚 LEARNING:
    Pydantic Settings automatically reads from .env file and validates types.
    This is the Python equivalent of using process.env in Node.js,
    but with automatic validation and type checking.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── Firebase ────────────────────────────────────────────────
    firebase_service_account_key: str = ""

    # ── AI Providers ────────────────────────────────────────────
    groq_api_key: str = ""
    google_ai_api_key: str = ""

    # ── Vector Database ─────────────────────────────────────────
    chroma_persist_dir: str = "./chroma_data"

    # ── CORS ────────────────────────────────────────────────────
    cors_origins: list[str] = [
        "http://localhost:3000",   # Next.js dev
        "http://127.0.0.1:3000",
    ]

    # ── Server ──────────────────────────────────────────────────
    debug: bool = True
    api_prefix: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton — import this everywhere
settings = Settings()
