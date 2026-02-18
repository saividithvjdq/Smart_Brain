'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
    FileText,
    Link2,
    Lightbulb,
    Sparkles,
    X,
    Plus,
    Check,
    Loader2,
    ArrowLeft,
    Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AxonIcon } from '@/components/ui/icons'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1] as const

const contentTypes = [
    {
        id: 'note',
        label: 'Note',
        icon: FileText,
        description: 'Capture thoughts and ideas',
        gradient: 'from-blue-500 to-blue-600',
        glow: 'shadow-blue-500/20',
        bg: 'bg-blue-500/10 border-blue-500/20',
        ring: 'ring-blue-500/30'
    },
    {
        id: 'link',
        label: 'Link',
        icon: Link2,
        description: 'Save web resources',
        gradient: 'from-emerald-500 to-emerald-600',
        glow: 'shadow-emerald-500/20',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        ring: 'ring-emerald-500/30'
    },
    {
        id: 'insight',
        label: 'Insight',
        icon: Lightbulb,
        description: 'Record key learnings',
        gradient: 'from-amber-500 to-amber-600',
        glow: 'shadow-amber-500/20',
        bg: 'bg-amber-500/10 border-amber-500/20',
        ring: 'ring-amber-500/30'
    },
]

export default function CapturePage() {
    const router = useRouter()
    const [type, setType] = useState<'note' | 'link' | 'insight'>('note')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [url, setUrl] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isAutoTagging, setIsAutoTagging] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const selectedType = contentTypes.find(t => t.id === type)!

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
            setTags([...tags, newTag.trim().toLowerCase()])
            setNewTag('')
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag))
    }

    const handleAutoTag = async () => {
        if (!content.trim()) return
        setIsAutoTagging(true)
        try {
            const res = await fetch('/api/ai/auto-tag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: title + ' ' + content }),
            })
            const data = await res.json()
            if (data.tags) {
                const newTags = data.tags.filter((t: string) => !tags.includes(t))
                setTags([...tags, ...newTags])
            }
        } catch {
            console.error('Auto-tag failed')
        } finally {
            setIsAutoTagging(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return

        setIsLoading(true)
        try {
            const res = await fetch('/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    type,
                    source_url: url || undefined,
                    tags,
                }),
            })

            if (res.ok) {
                setIsSuccess(true)
                setTimeout(() => router.push('/dashboard'), 1500)
            }
        } catch {
            console.error('Failed to save')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center mx-auto mb-6"
                    >
                        <Check className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-2">Knowledge Captured</h2>
                    <p className="text-muted-foreground text-sm">Redirecting to dashboard...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 relative">
            {/* Background effect */}
            <div className="absolute top-20 right-0 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Back Link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
            >
                <h1 className="text-3xl font-bold mb-1">Capture Knowledge</h1>
                <p className="text-muted-foreground text-sm">Add a new piece of knowledge to your brain.</p>
            </motion.div>

            {/* Type Selection - Gradient Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
                className="grid grid-cols-3 gap-3"
            >
                {contentTypes.map((cType) => (
                    <button
                        key={cType.id}
                        type="button"
                        onClick={() => setType(cType.id as typeof type)}
                        className={cn(
                            'p-4 rounded-xl border transition-all text-left relative overflow-hidden group',
                            type === cType.id
                                ? `border-transparent ring-2 ${cType.ring} bg-white/[0.04]`
                                : 'border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]'
                        )}
                    >
                        {type === cType.id && (
                            <motion.div
                                layoutId="type-active"
                                className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <div className="relative z-10">
                            <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all',
                                type === cType.id
                                    ? `bg-gradient-to-br ${cType.gradient} shadow-lg ${cType.glow}`
                                    : `${cType.bg} border`
                            )}>
                                <cType.icon className={cn('w-5 h-5', type === cType.id ? 'text-white' : '')} />
                            </div>
                            <h3 className="font-semibold text-sm mb-0.5">{cType.label}</h3>
                            <p className="text-[11px] text-muted-foreground leading-tight">{cType.description}</p>
                        </div>
                    </button>
                ))}
            </motion.div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease }}
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <Card className="p-6 border-white/[0.06] space-y-5 relative overflow-hidden">
                    {/* Subtle gradient accent at top */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${selectedType.gradient}`} />

                    {/* Title */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What is this about?"
                            className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 placeholder:text-muted-foreground/40"
                        />
                    </div>

                    {/* URL (for links) */}
                    <AnimatePresence>
                        {type === 'link' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <label className="text-sm font-semibold mb-2 block">URL</label>
                                <Input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 placeholder:text-muted-foreground/40"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Content</label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts, notes, or insights..."
                            className="min-h-[180px] bg-white/[0.03] border-white/[0.08] focus:border-primary/40 resize-none placeholder:text-muted-foreground/40"
                        />
                        <p className="text-[11px] text-muted-foreground/50 mt-1.5">
                            {content.length} characters
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                    {/* Tags */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold">Tags</label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleAutoTag}
                                disabled={isAutoTagging || !content.trim()}
                                className="text-primary hover:text-primary/80 text-xs h-7"
                            >
                                {isAutoTagging ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                ) : (
                                    <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                                )}
                                AI Generate
                            </Button>
                        </div>

                        {/* Tag Input */}
                        <div className="flex gap-2 mb-3">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add a tag..."
                                className="bg-white/[0.03] border-white/[0.08] focus:border-primary/40 placeholder:text-muted-foreground/40"
                            />
                            <Button type="button" onClick={addTag} variant="outline" className="shrink-0 border-white/[0.08]">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Tags List */}
                        <AnimatePresence>
                            {tags.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {tags.map((tag) => (
                                        <motion.div
                                            key={tag}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                        >
                                            <Badge
                                                variant="secondary"
                                                className="bg-primary/10 text-primary border border-primary/20 pr-1"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1.5 p-0.5 hover:bg-white/10 rounded"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="border-white/[0.08] hover:bg-white/[0.04]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!title.trim() || !content.trim() || isLoading}
                        className="bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/25 min-w-[140px] transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>Save Knowledge</>
                        )}
                    </Button>
                </div>
            </motion.form>
        </div>
    )
}
