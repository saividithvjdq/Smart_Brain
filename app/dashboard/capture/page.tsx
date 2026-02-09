'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1]

const contentTypes = [
    {
        id: 'note',
        label: 'Note',
        icon: FileText,
        description: 'Capture thoughts and ideas',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
        id: 'link',
        label: 'Link',
        icon: Link2,
        description: 'Save web resources',
        color: 'text-green-400 bg-green-500/10 border-green-500/30'
    },
    {
        id: 'insight',
        label: 'Insight',
        icon: Lightbulb,
        description: 'Record key learnings',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
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
                    <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Knowledge Captured!</h2>
                    <p className="text-muted-foreground">Redirecting to dashboard...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
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
                <h1 className="text-3xl font-bold mb-2">Capture Knowledge</h1>
                <p className="text-muted-foreground">Add a new piece of knowledge to your brain.</p>
            </motion.div>

            {/* Type Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
                className="grid grid-cols-3 gap-4"
            >
                {contentTypes.map((cType) => (
                    <button
                        key={cType.id}
                        type="button"
                        onClick={() => setType(cType.id as typeof type)}
                        className={cn(
                            'p-4 rounded-xl border transition-all text-left',
                            type === cType.id
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                : 'border-border glass-card hover:border-white/20'
                        )}
                    >
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', cType.color)}>
                            <cType.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold mb-1">{cType.label}</h3>
                        <p className="text-xs text-muted-foreground">{cType.description}</p>
                    </button>
                ))}
            </motion.div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease }}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <Card className="p-6 glass-card space-y-6">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's this about?"
                            className="bg-black/20 border-border focus:border-primary/50"
                        />
                    </div>

                    {/* URL (for links) */}
                    {type === 'link' && (
                        <div>
                            <label className="text-sm font-medium mb-2 block">URL</label>
                            <Input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="bg-black/20 border-border focus:border-primary/50"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Content</label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts, notes, or insights..."
                            className="min-h-[200px] bg-black/20 border-border focus:border-primary/50 resize-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Tags</label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleAutoTag}
                                disabled={isAutoTagging || !content.trim()}
                                className="text-primary hover:text-primary/80"
                            >
                                {isAutoTagging ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2" />
                                )}
                                Auto-generate
                            </Button>
                        </div>

                        {/* Tag Input */}
                        <div className="flex gap-2 mb-3">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add a tag..."
                                className="bg-black/20 border-border focus:border-primary/50"
                            />
                            <Button type="button" onClick={addTag} variant="outline" className="shrink-0">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Tags List */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-primary/10 text-primary border border-primary/30 pr-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 p-0.5 hover:bg-white/10 rounded"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="border-border"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!title.trim() || !content.trim() || isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
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
