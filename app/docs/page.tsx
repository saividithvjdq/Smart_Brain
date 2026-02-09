import { Metadata } from 'next'
import { Brain, Layers, Lightbulb, Zap, Globe, Code2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
    title: 'Documentation | Second Brain',
    description: 'Architecture, UX principles, and API documentation for Second Brain',
}

const architectureLayers = [
    {
        name: 'Client Layer',
        tech: 'Next.js + React + Tailwind + shadcn/ui + Framer Motion',
        features: ['Rich Capture Form', 'Searchable Dashboard', 'Conversational AI Query'],
        gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
        name: 'Auth Layer',
        tech: 'Supabase Auth (JWT Sessions)',
        features: ['Secure Row-Level Access', 'Session Management'],
        gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
        name: 'API Layer',
        tech: 'Next.js API Routes + Zod Validation',
        features: ['Optimistic UI', 'HTTP 202 Accepted', 'RESTful Design'],
        gradient: 'from-yellow-500/20 to-orange-500/20',
    },
    {
        name: 'DB Layer',
        tech: 'Supabase PostgreSQL + pgvector',
        features: ['KnowledgeItem Schema', 'Semantic Embeddings', 'Vector Search'],
        gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
        name: 'Async AI Layer',
        tech: 'Supabase Edge Functions + Groq/Gemini',
        features: ['GPT-4o Summarization', 'Auto-Tagging', 'Embedding Gen'],
        gradient: 'from-indigo-500/20 to-violet-500/20',
    },
]

const uxPrinciples = [
    {
        title: 'Optimistic Updates',
        description: 'Show changes immediately while processing in background. Never block the user.',
        icon: Zap,
    },
    {
        title: 'Progressive Disclosure',
        description: 'Start simple, reveal complexity as needed. AI features enhance, not overwhelm.',
        icon: Layers,
    },
    {
        title: 'Transparency in AI',
        description: 'Always show sources and cite origins. Users should trust but verify.',
        icon: Lightbulb,
    },
    {
        title: 'Contextual Intelligence',
        description: 'AI adapts to user intent - transform active notes or query entire knowledge base.',
        icon: Brain,
    },
    {
        title: 'Infrastructure Mindset',
        description: 'Every feature exposed via API. Build for integration, not isolation.',
        icon: Globe,
    },
]

const apiEndpoints = [
    {
        method: 'GET',
        path: '/api/public/brain/query',
        description: 'Query the public knowledge base',
        params: [{ name: 'q', type: 'string', required: true, description: 'The question to ask' }],
        response: '{ answer: string, sources: Source[], meta: { query, timestamp, source_count } }',
    },
    {
        method: 'GET',
        path: '/api/knowledge',
        description: 'List knowledge items with optional filters',
        params: [
            { name: 'type', type: 'string', required: false, description: 'Filter by type (note/link/insight)' },
            { name: 'tags', type: 'string', required: false, description: 'Comma-separated tags to filter' },
            { name: 'search', type: 'string', required: false, description: 'Search in title and content' },
        ],
        response: '{ items: KnowledgeItem[], count: number }',
    },
    {
        method: 'POST',
        path: '/api/knowledge',
        description: 'Create a new knowledge item',
        body: '{ title: string, content: string, type: "note"|"link"|"insight", source_url?: string, tags?: string[] }',
        response: '{ message: string, item: KnowledgeItem }',
    },
    {
        method: 'POST',
        path: '/api/ai/query',
        description: 'Query knowledge base with RAG',
        body: '{ question: string }',
        response: '{ answer: string, sources: Source[] }',
    },
    {
        method: 'POST',
        path: '/api/ai/auto-tag',
        description: 'Generate tags for content',
        body: '{ title?: string, content: string }',
        response: '{ tags: string[] }',
    },
    {
        method: 'POST',
        path: '/api/ai/summarize',
        description: 'Generate summary for content',
        body: '{ content: string }',
        response: '{ summary: string }',
    },
]

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-white/5 glass-subtle">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Second Brain Documentation</h1>
                            <p className="text-muted-foreground">Architecture, Principles, and API Reference</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
                {/* Portable Architecture */}
                <section id="architecture">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-indigo-400" />
                        Portable Architecture
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Clean separation of concerns with swappable components at each layer.
                    </p>

                    <div className="space-y-4">
                        {architectureLayers.map((layer, index) => (
                            <Card key={layer.name} className={`p-6 glass bg-gradient-to-r ${layer.gradient}`}>
                                <div className="flex items-start justify-between flex-wrap gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-mono text-muted-foreground">({index + 1})</span>
                                            <h3 className="text-lg font-semibold">{layer.name}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{layer.tech}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {layer.features.map((feature) => (
                                                <Badge key={feature} variant="secondary" className="text-xs">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* UX Principles */}
                <section id="ux-principles">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Lightbulb className="w-6 h-6 text-amber-400" />
                        Principles-Based UX
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Design principles guiding AI interaction patterns throughout the application.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {uxPrinciples.map((principle) => (
                            <Card key={principle.title} className="p-6 glass">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                    <principle.icon className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="font-semibold mb-2">{principle.title}</h3>
                                <p className="text-sm text-muted-foreground">{principle.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Agent Thinking */}
                <section id="agent-thinking">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-400" />
                        Agent Thinking
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Autonomous automation that maintains and improves the system over time.
                    </p>

                    <Card className="p-6 glass">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Self-Improving Pipeline</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                    <li><span className="text-foreground">On Capture:</span> Item saved immediately → Background job generates summary, tags, and embedding</li>
                                    <li><span className="text-foreground">Context Engine:</span> Detects intent (query vs transform) → Routes to appropriate processing</li>
                                    <li><span className="text-foreground">RAG Pipeline:</span> Semantic search → Context composition → LLM generation with citations</li>
                                    <li><span className="text-foreground">Continuous Improvement:</span> Daily cron re-processes items with better models or prompts</li>
                                </ol>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Key Automations</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• <span className="text-foreground">Auto-Summarization:</span> Every knowledge item gets a concise AI summary</li>
                                    <li>• <span className="text-foreground">Auto-Tagging:</span> AI suggests relevant tags based on content analysis</li>
                                    <li>• <span className="text-foreground">Embedding Generation:</span> Semantic vectors for similarity search</li>
                                    <li>• <span className="text-foreground">Metadata Enrichment:</span> Re-run AI on items with missing or weak metadata</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* API Reference */}
                <section id="api">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-green-400" />
                        API Reference
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Infrastructure mindset: all functionality exposed via API or embeddable widget.
                    </p>

                    <div className="space-y-6">
                        {apiEndpoints.map((endpoint) => (
                            <Card key={`${endpoint.method}-${endpoint.path}`} className="p-6 glass overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge
                                        variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                                        className={endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}
                                    >
                                        {endpoint.method}
                                    </Badge>
                                    <code className="text-sm font-mono">{endpoint.path}</code>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>

                                {endpoint.params && (
                                    <div className="mb-4">
                                        <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">Parameters</h4>
                                        <div className="space-y-1">
                                            {endpoint.params.map((param) => (
                                                <div key={param.name} className="text-sm flex gap-2">
                                                    <code className="text-indigo-400">{param.name}</code>
                                                    <span className="text-muted-foreground">({param.type}{param.required ? ', required' : ''}) - {param.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {endpoint.body && (
                                    <div className="mb-4">
                                        <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">Request Body</h4>
                                        <code className="text-xs bg-white/5 p-2 rounded block overflow-x-auto">{endpoint.body}</code>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">Response</h4>
                                    <code className="text-xs bg-white/5 p-2 rounded block overflow-x-auto">{endpoint.response}</code>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Embed Widget */}
                <section id="widget">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Globe className="w-6 h-6 text-cyan-400" />
                        Embeddable Widget
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Embed the Second Brain search in any website with a simple iframe.
                    </p>

                    <Card className="p-6 glass">
                        <h3 className="font-semibold mb-4">Embed Code</h3>
                        <pre className="bg-white/5 p-4 rounded-lg overflow-x-auto text-sm">
                            {`<iframe
  src="https://your-domain.com/widget"
  width="400"
  height="500"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"
></iframe>`}
                        </pre>
                    </Card>
                </section>
            </main>
        </div>
    )
}
