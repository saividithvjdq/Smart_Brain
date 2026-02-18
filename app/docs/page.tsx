import { Metadata } from 'next'
import { Layers, Lightbulb, Zap, Globe, Code2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { AxonIcon } from '@/components/ui/icons'

export const metadata: Metadata = {
    title: 'Documentation | Second Brain',
    description: 'Architecture, UX principles, and API documentation for Second Brain',
}

const architectureLayers = [
    {
        name: 'Client Layer',
        tech: 'Next.js + React + Tailwind + shadcn/ui + Framer Motion',
        features: ['Rich Capture Form', 'Searchable Dashboard', 'Conversational AI Query'],
        gradient: 'from-blue-500/20 to-cyan-500/10',
        accent: 'border-l-blue-500',
    },
    {
        name: 'Auth Layer',
        tech: 'Firebase Auth (JWT Sessions)',
        features: ['Secure Access Control', 'Session Management'],
        gradient: 'from-green-500/20 to-emerald-500/10',
        accent: 'border-l-green-500',
    },
    {
        name: 'API Layer',
        tech: 'Next.js API Routes + Zod Validation',
        features: ['Optimistic UI', 'HTTP 202 Accepted', 'RESTful Design'],
        gradient: 'from-yellow-500/20 to-orange-500/10',
        accent: 'border-l-yellow-500',
    },
    {
        name: 'DB Layer',
        tech: 'Firebase Firestore',
        features: ['KnowledgeItem Collection', 'Real-time Sync', 'Cloud Storage'],
        gradient: 'from-purple-500/20 to-pink-500/10',
        accent: 'border-l-purple-500',
    },
    {
        name: 'Async AI Layer',
        tech: 'Groq / Gemini APIs',
        features: ['Summarization', 'Auto-Tagging', 'Embedding Generation'],
        gradient: 'from-indigo-500/20 to-violet-500/10',
        accent: 'border-l-indigo-500',
    },
]

const uxPrinciples = [
    {
        title: 'Optimistic Updates',
        description: 'Show changes immediately while processing in background. Never block the user.',
        icon: Zap,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
    {
        title: 'Progressive Disclosure',
        description: 'Start simple, reveal complexity as needed. AI features enhance without overwhelming.',
        icon: Layers,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
    },
    {
        title: 'Transparency in AI',
        description: 'Always show sources and cite origins. Users should trust but verify.',
        icon: Lightbulb,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
    },
    {
        title: 'Contextual Intelligence',
        description: 'AI adapts to user intent - transform active notes or query entire knowledge base.',
        icon: AxonIcon,
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        isAxon: true,
    },
    {
        title: 'Infrastructure Mindset',
        description: 'Every feature exposed via API. Build for integration, not isolation.',
        icon: Globe,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
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

const methodColors: Record<string, string> = {
    GET: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    POST: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    PUT: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    DELETE: 'bg-red-500/15 text-red-400 border border-red-500/20',
}

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-white/[0.06] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
                <div className="max-w-6xl mx-auto px-6 py-10 relative">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
                        <AxonIcon size={16} className="text-primary" />
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Documentation</h1>
                    <p className="text-muted-foreground max-w-xl">
                        Architecture overview, design principles, and complete API reference for the Axon platform.
                    </p>

                    {/* Quick nav */}
                    <div className="flex gap-2 mt-6">
                        {[
                            { label: 'Architecture', href: '#architecture' },
                            { label: 'UX Principles', href: '#ux-principles' },
                            { label: 'Agent Thinking', href: '#agent-thinking' },
                            { label: 'API Reference', href: '#api' },
                            { label: 'Widget', href: '#widget' },
                        ].map((nav) => (
                            <a
                                key={nav.href}
                                href={nav.href}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/[0.12] transition-all"
                            >
                                {nav.label}
                            </a>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
                {/* Architecture */}
                <section id="architecture">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Portable Architecture</h2>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8 ml-11">
                        Clean separation of concerns with swappable components at each layer.
                    </p>

                    <div className="space-y-3">
                        {architectureLayers.map((layer, index) => (
                            <Card key={layer.name} className={`p-5 border-white/[0.06] border-l-2 ${layer.accent} relative overflow-hidden`}>
                                <div className={`absolute inset-0 bg-gradient-to-r ${layer.gradient} opacity-40`} />
                                <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <span className="text-xs font-mono text-muted-foreground/50 bg-white/[0.04] px-1.5 py-0.5 rounded">{String(index + 1).padStart(2, '0')}</span>
                                            <h3 className="text-base font-bold">{layer.name}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3 ml-9 font-mono">{layer.tech}</p>
                                        <div className="flex flex-wrap gap-1.5 ml-9">
                                            {layer.features.map((feature) => (
                                                <span key={feature} className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-muted-foreground">
                                                    {feature}
                                                </span>
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Principles-Based UX</h2>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8 ml-11">
                        Design principles guiding AI interaction patterns throughout the application.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uxPrinciples.map((principle) => (
                            <Card key={principle.title} className="p-5 border-white/[0.06] hover:border-white/[0.12] transition-all group">
                                <div className={`w-10 h-10 rounded-xl ${principle.bg} border border-white/[0.06] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    {principle.isAxon ? (
                                        <AxonIcon size={18} className={principle.color} />
                                    ) : (
                                        <principle.icon className={`w-5 h-5 ${principle.color}`} />
                                    )}
                                </div>
                                <h3 className="font-bold text-sm mb-1.5">{principle.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{principle.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Agent Thinking */}
                <section id="agent-thinking">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <AxonIcon size={16} className="text-violet-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Agent Thinking</h2>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8 ml-11">
                        Autonomous automation that maintains and improves the system over time.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="p-5 border-white/[0.06]">
                            <h3 className="font-bold text-sm mb-4">Self-Improving Pipeline</h3>
                            <ol className="space-y-3 text-sm">
                                {[
                                    { step: 'On Capture', desc: 'Item saved immediately. Background job generates summary, tags, and embedding.' },
                                    { step: 'Context Engine', desc: 'Detects intent (query vs transform). Routes to appropriate processing.' },
                                    { step: 'RAG Pipeline', desc: 'Semantic search, context composition, LLM generation with citations.' },
                                    { step: 'Continuous Improvement', desc: 'Daily cron re-processes items with better models or prompts.' },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded h-fit shrink-0">{i + 1}</span>
                                        <div>
                                            <span className="font-semibold text-white">{item.step}</span>
                                            <span className="text-muted-foreground"> - {item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </Card>

                        <Card className="p-5 border-white/[0.06]">
                            <h3 className="font-bold text-sm mb-4">Key Automations</h3>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { title: 'Auto-Summarization', desc: 'Every knowledge item gets a concise AI summary' },
                                    { title: 'Auto-Tagging', desc: 'AI suggests relevant tags based on content analysis' },
                                    { title: 'Embedding Generation', desc: 'Semantic vectors for similarity search' },
                                    { title: 'Metadata Enrichment', desc: 'Re-run AI on items with missing or weak metadata' },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                        <div>
                                            <span className="font-semibold text-white">{item.title}</span>
                                            <span className="text-muted-foreground"> - {item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </section>

                {/* API Reference */}
                <section id="api">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold">API Reference</h2>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8 ml-11">
                        Infrastructure mindset: all functionality exposed via API or embeddable widget.
                    </p>

                    <div className="space-y-4">
                        {apiEndpoints.map((endpoint) => (
                            <Card key={`${endpoint.method}-${endpoint.path}`} className="p-5 border-white/[0.06] overflow-hidden">
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge className={methodColors[endpoint.method] || ''}>
                                        {endpoint.method}
                                    </Badge>
                                    <code className="text-sm font-mono text-muted-foreground">{endpoint.path}</code>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>

                                {endpoint.params && (
                                    <div className="mb-3">
                                        <h4 className="text-[11px] font-bold uppercase text-muted-foreground/60 mb-2 tracking-wider">Parameters</h4>
                                        <div className="space-y-1.5">
                                            {endpoint.params.map((param) => (
                                                <div key={param.name} className="text-xs flex items-baseline gap-2">
                                                    <code className="text-primary font-medium">{param.name}</code>
                                                    <span className="text-muted-foreground/50 font-mono">{param.type}</span>
                                                    {param.required && <span className="text-[10px] text-red-400 bg-red-500/10 px-1 rounded">required</span>}
                                                    <span className="text-muted-foreground">{param.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {endpoint.body && (
                                    <div className="mb-3">
                                        <h4 className="text-[11px] font-bold uppercase text-muted-foreground/60 mb-2 tracking-wider">Request Body</h4>
                                        <code className="text-xs bg-white/[0.03] border border-white/[0.06] p-2.5 rounded-lg block overflow-x-auto font-mono text-muted-foreground">{endpoint.body}</code>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-[11px] font-bold uppercase text-muted-foreground/60 mb-2 tracking-wider">Response</h4>
                                    <code className="text-xs bg-white/[0.03] border border-white/[0.06] p-2.5 rounded-lg block overflow-x-auto font-mono text-emerald-400/80">{endpoint.response}</code>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Widget */}
                <section id="widget">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Embeddable Widget</h2>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8 ml-11">
                        Embed the Second Brain search in any website with a simple iframe.
                    </p>

                    <Card className="p-5 border-white/[0.06]">
                        <h3 className="font-bold text-sm mb-3">Embed Code</h3>
                        <pre className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-lg overflow-x-auto text-sm font-mono text-muted-foreground">
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

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-8">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AxonIcon size={16} className="text-primary" />
                        <span className="text-sm font-semibold">Axon</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Built with Next.js, Firebase, and AI</p>
                </div>
            </footer>
        </div>
    )
}
