# 🧠 Axon Second Brain — Python Backend

AI-powered knowledge management API built with FastAPI.

## Architecture

```
app/
├── main.py          ← FastAPI entry point
├── config.py        ← Environment settings (Pydantic)
├── models/          ← Request/Response schemas (like Zod in TS)
├── routers/         ← API endpoints (like Express Router)
├── services/        ← Business logic (LLM, RAG, MCP)
├── db/              ← Database layer (Firebase, ChromaDB)
└── middleware/      ← Auth, rate limiting
```

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
# Copy your API keys into .env

# 4. Run the server
uvicorn app.main:app --reload --port 8000
```

**API Docs:** http://localhost:8000/docs

## Key Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Health check |
| POST | `/ai/summarize` | ❌ | Summarize content |
| POST | `/ai/auto-tag` | ❌ | Generate tags |
| POST | `/ai/query` | ✅ | RAG query |
| GET | `/knowledge/` | ✅ | List items |
| POST | `/knowledge/` | ✅ | Create item |
| GET | `/public/brain/query?q=...` | ❌ | Public API |

## Tech Stack

- **FastAPI** — async Python web framework
- **Groq** (LLaMA 3.3) — fast LLM inference
- **Google Gemini** — embeddings + fallback LLM
- **ChromaDB** — local vector database
- **Firebase** — auth + Firestore database
