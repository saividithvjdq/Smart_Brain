# Axon ⚡

**The operating system for your thoughts.**

An AI-powered knowledge management system that helps you capture, organize, and surface your knowledge using semantic search and AI-generated insights.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

- **📝 Smart Capture** - Save notes, links, and insights with AI-powered auto-tagging
- **🔍 Semantic Search** - Find knowledge using natural language, not just keywords
- **💬 Ask Axon** - Query your knowledge base conversationally with cited sources
- **📊 Dashboard** - Beautiful overview of your collected knowledge
- **🌐 Public API** - Rate-limited API for external integrations
- **📦 Embeddable Widget** - Drop-in widget for any website

## 🎨 Design

Inspired by modern SaaS applications like Linear, Vercel, and Scalepro:
- **Dark theme** with pure black background (#050505)
- **Lime accent** (#E5FF3D) for high contrast
- **Glassmorphism** with subtle borders
- **Smooth animations** powered by Framer Motion

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│     Next.js 16 + React 19 + Tailwind + Framer Motion        │
├─────────────────────────────────────────────────────────────┤
│                     API LAYER                                │
│         Next.js API Routes + Zod Validation                  │
├─────────────────────────────────────────────────────────────┤
│                      AI LAYER                                │
│    RAG Engine + Context Detection + Auto-Summarization      │
├─────────────────────────────────────────────────────────────┤
│                    DATABASE LAYER                            │
│        Supabase PostgreSQL + pgvector Embeddings            │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Groq API key
- Google AI API key

### Installation

```bash
# Clone
git clone https://github.com/saividithvjdq/second-brain.git
cd second-brain

# Install
npm install

# Configure
cp .env.example .env
# Add your API keys to .env

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Supabase Setup

Run in SQL Editor:

```sql
create extension if not exists vector;

create table public.knowledge_items (
  id uuid default gen_random_uuid() primary key,
  user_id text default 'demo-user',
  title text not null,
  content text not null,
  type text check (type in ('note', 'link', 'insight')) not null,
  source_url text,
  tags text[] default '{}',
  summary text,
  embedding vector(768),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on knowledge_items 
using ivfflat (embedding vector_cosine_ops) with (lists = 100);
```

## 📚 API Reference

### Public API

```http
GET /api/public/brain/query?q=your+question
```

Rate limit: 10 requests/minute

### Private API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/knowledge` | GET/POST | Knowledge CRUD |
| `/api/ai/query` | POST | RAG Q&A |
| `/api/ai/auto-tag` | POST | Generate tags |
| `/api/ai/summarize` | POST | Summarize content |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animation**: Framer Motion
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Groq (LLM) + Google Gemini (Embeddings)

## 📁 Project Structure

```
axon/
├── app/
│   ├── dashboard/        # Dashboard pages
│   ├── docs/             # Documentation
│   ├── widget/           # Embeddable widget
│   └── api/              # API routes
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── landing/          # Landing page sections
│   └── ui/               # shadcn/ui components
└── lib/
    ├── ai/               # AI providers & RAG
    └── supabase/         # Database clients
```

## 📄 License

MIT © 2024

---

Built with ⚡ for the Altibbe Full-Stack Engineering Internship
