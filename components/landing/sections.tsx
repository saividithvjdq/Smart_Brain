'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import {
    Sparkles,
    ArrowRight,
    Play,
    Zap,
    Brain,
    Search,
    MessageSquare,
    Globe,
    ChevronDown,
    Menu,
    X,
    Check,
    Users,
    Send,
    Mail,
    Smartphone,
    Code2,
    FileText,
    Lightbulb
} from 'lucide-react'
import { AxonIcon, VoiceWaveform, FloatAnimation } from '@/components/ui/icons'
import ShaderBackground from '@/components/ui/shader-background'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { GradientButton } from '@/components/ui/gradient-button'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'


// Smooth easing
const ease = [0.16, 1, 0.3, 1] as const

// Navigation
export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between px-6 py-3 rounded-2xl glass">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <AxonIcon size={32} className="group-hover:scale-105 transition-transform" />
                        <span className="text-xl font-semibold tracking-tight">Axon</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                        <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:block">
                        <Link href="/dashboard" className="px-5 py-2.5 text-sm font-medium btn-primary rounded-xl">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-2 p-4 rounded-xl glass"
                    >
                        <div className="flex flex-col gap-4">
                            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
                            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How it Works</a>
                            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
                            <hr className="border-border" />
                            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium btn-primary rounded-lg text-center">
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}

// Hero Section - Scalepro Style with Tilted Dashboard
export function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <motion.section
            ref={heroRef}
            style={{ opacity }}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-60">
                <ShaderBackground slow={false} />
            </div>

            {/* Content */}
            <motion.div
                style={{ y }}
                className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6"
            >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease }}
                            className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm mb-6 sm:mb-8"
                        >
                            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-muted-foreground">Latest release</span>
                            <span className="text-foreground hidden sm:inline">· Introducing Axon AI</span>
                        </motion.div>

                        {/* Headline - Scalepro "10x" style - Mobile optimized */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8, ease }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight-heading leading-[1.1] mb-4 sm:mb-6 text-hero-glow"
                        >
                            Turn scattered thoughts into
                            <br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>connected knowledge –
                            <br />
                            <span className="gradient-text-animated">10x</span> faster.
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease }}
                            className="text-lg text-muted-foreground max-w-lg mb-8"
                        >
                            Capture, engage, and connect more ideas with a platform built to drive real growth – no complicated setups, no wasted time.
                        </motion.p>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, ease }}
                            className="flex items-center gap-4 mb-8 p-4 rounded-xl glass-subtle border border-border"
                        >
                            {/* Avatar Stack */}
                            <div className="avatar-stack">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center"
                                    >
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-medium">Join 10k+ knowledge workers</p>
                                <p className="text-xs text-muted-foreground">Don't miss out on this opportunity to grow your network.</p>
                            </div>
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6, ease }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <GradientButton asChild size="lg">
                                <Link href="/dashboard">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </GradientButton>
                            <InteractiveHoverButton>
                                <Play className="w-4 h-4 mr-2 inline" />
                                Watch Demo
                            </InteractiveHoverButton>
                        </motion.div>
                    </div>

                    {/* Right: Tilted Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease }}
                        className="relative perspective-container"
                    >
                        <div className="tilted-card relative rounded-2xl overflow-hidden glow-border">
                            {/* Dashboard UI */}
                            <div className="bg-[#0F0F15] rounded-xl overflow-hidden border border-white/5">
                                {/* Top Bar */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium">Axon</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Dashboard / Overview</div>
                                </div>

                                <div className="flex">
                                    {/* Sidebar */}
                                    <div className="w-48 border-r border-white/5 p-3 space-y-1">
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm">
                                            <div className="w-4 h-4 rounded bg-primary/30" />
                                            <span>Overview</span>
                                        </div>
                                        {['Knowledge', 'Insights', 'Search', 'Automations', 'AI Chat', 'Analytics'].map((item) => (
                                            <div key={item} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                                                <div className="w-4 h-4 rounded bg-white/5" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-medium">Knowledge overview</h3>
                                                <p className="text-xs text-muted-foreground">Today, Oct 15, 2025</p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                                        <Brain className="w-4 h-4 text-primary" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold">12,486</div>
                                                <div className="text-xs text-muted-foreground">Total Ideas</div>
                                                <div className="text-xs text-green-400 mt-1">↑ +12% from last week</div>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="text-2xl font-bold">27.3%</div>
                                                <div className="text-xs text-muted-foreground">Connection Rate</div>
                                                <div className="text-xs text-green-400 mt-1">↑ +5.4% from last week</div>
                                            </div>
                                        </div>

                                        {/* Chart Placeholder */}
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-sm font-medium mb-2">Engagement Overview</div>
                                            <div className="text-xs text-muted-foreground mb-3">+76% connections from last Period</div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                    <span className="text-xs">Impressions</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-white/30" />
                                                    <span className="text-xs">Connections</span>
                                                </div>
                                            </div>
                                            {/* Simple chart line */}
                                            <svg className="w-full h-16" viewBox="0 0 200 50">
                                                <path
                                                    d="M0,40 Q30,35 50,30 T100,20 T150,25 T200,15"
                                                    fill="none"
                                                    stroke="rgba(139,92,246,0.5)"
                                                    strokeWidth="2"
                                                />
                                                <path
                                                    d="M0,45 Q30,42 50,38 T100,35 T150,32 T200,30"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.2)"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <motion.div
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -left-8 top-1/4 px-3 py-2 rounded-xl glass-card border border-white/10 flex items-center gap-2"
                        >
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-xs">AI Synced</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [5, -5, 5] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute -right-4 bottom-1/3 px-3 py-2 rounded-xl glass-card border border-white/10 flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs">+24 insights</span>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom light beam - Scalepro style */}
            <div className="absolute bottom-0 left-0 right-0 h-px">
                <div className="light-beam" />
                <div className="light-beam-glow -translate-y-8" />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
            </motion.div>
        </motion.section>
    )
}

// Features Section - Scalepro Inspired Clean Design
export function FeaturesSection() {
    const ref = useRef<HTMLDivElement>(null)

    return (
        <section id="features" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Big headline with logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                            AI-Powered Knowledge
                            <br />
                            <span className="text-muted-foreground">Platform for the Modern Era</span>
                        </h2>
                    </motion.div>

                    {/* Right side - Clean feature list */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease }}
                        className="space-y-8"
                    >
                        {[
                            { title: 'Smart Capture', desc: 'AI organizes your notes, links, and ideas automatically' },
                            { title: 'Semantic Search', desc: 'Find anything with natural language queries' },
                            { title: 'Knowledge Chat', desc: 'Get answers sourced from your own notes' },
                            { title: 'Public API', desc: 'Embed your brain anywhere with rate-limited access' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                                className="group relative p-5 rounded-2xl bg-[#0B0914] border border-white/5"
                            >
                                <GlowingEffect blur={15} spread={20} glow={true} variant="purple" />
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2.5 group-hover:scale-150 transition-transform" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Powered by text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="text-sm text-muted-foreground pt-8"
                        >
                            Powered by <span className="text-white font-medium">Axon</span>
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// Platform Benefits Section - Scalepro Mobile Mockup Style
// Text inside a phone mockup with light beam
export function PlatformBenefitsSection() {
    const benefits = [
        {
            icon: Sparkles,
            title: 'Capture thoughts instantly',
            description: 'Notes, links, and insights saved with a single click.'
        },
        {
            icon: Brain,
            title: 'AI-powered recall',
            description: 'Search semantically. Ask questions naturally.'
        },
        {
            icon: Globe,
            title: 'Access from anywhere',
            description: 'Web, WhatsApp, API – always just a message away.'
        },
    ]

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left: Mobile Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease }}
                        className="relative flex justify-center"
                    >
                        {/* Phone Frame */}
                        <div className="relative w-[280px] sm:w-[320px] md:w-[340px]">
                            {/* Phone outer shell */}
                            <div className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl border border-white/10">
                                {/* Phone notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-b-2xl z-20" />

                                {/* Phone screen */}
                                <div className="relative bg-background rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                                    {/* Screen content */}
                                    <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                                        {/* Small logo/badge */}
                                        <div className="flex justify-end mb-4">
                                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground">Axon</span>
                                        </div>

                                        {/* Main Text with highlighted keywords */}
                                        <p className="text-sm sm:text-base leading-relaxed text-white/90 text-right">
                                            Our platform brings{' '}
                                            <span className="text-primary font-semibold">knowledge capture</span>,{' '}
                                            <span className="text-primary font-semibold">AI-powered recall</span>,{' '}
                                            and <span className="text-primary font-semibold">semantic connections</span>{' '}
                                            together in one seamless experience – so you can focus on{' '}
                                            <span className="gradient-text-purple font-semibold">building your ideas</span>,{' '}
                                            not chasing them.
                                        </p>

                                        {/* Light Beam Effect */}
                                        <div className="relative my-8">
                                            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
                                            <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                                        </div>

                                        {/* What can you achieve section */}
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                                                    <Sparkles className="w-3 h-3 text-primary" />
                                                </div>
                                                <span className="text-xs text-muted-foreground">What can you achieve with Axon?</span>
                                            </div>
                                            <p className="text-sm font-medium text-white">Capture thoughts instantly</p>
                                            <p className="text-xs text-muted-foreground mt-1">Notes, links, and insights saved with a single click.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phone side button */}
                            <div className="absolute top-28 -right-1 w-1 h-12 bg-[#2a2a2a] rounded-r-lg" />
                            <div className="absolute top-20 -left-1 w-1 h-8 bg-[#2a2a2a] rounded-l-lg" />
                            <div className="absolute top-32 -left-1 w-1 h-16 bg-[#2a2a2a] rounded-l-lg" />
                        </div>

                        {/* Glow behind phone */}
                        <div className="absolute inset-0 blur-3xl opacity-30">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/40 rounded-full" />
                        </div>
                    </motion.div>

                    {/* Right: Benefits Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease }}
                        className="space-y-5"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                            What can you achieve<br />
                            <span className="text-muted-foreground">with Axon?</span>
                        </h2>

                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease }}
                                className="relative p-5 rounded-xl border border-white/5 bg-[#0B0914] transition-all group"
                            >
                                <GlowingEffect blur={10} spread={15} glow={true} variant="purple" inactiveZone={0.6} proximity={60} />
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <benefit.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// Chat Interfaces Section - HelloAria Style
// Combined Chat Interfaces + Integrations Section
export function ChatInterfacesSection() {
    const platforms = [
        { name: 'WhatsApp', Icon: MessageSquare, status: 'Soon', iconBg: 'bg-gradient-to-br from-green-500 to-green-600', borderColor: 'border-green-500/20' },
        { name: 'Telegram', Icon: Send, status: 'Soon', iconBg: 'bg-gradient-to-br from-blue-400 to-blue-500', borderColor: 'border-blue-500/20' },
        { name: 'Web App', Icon: Globe, status: 'Live', iconBg: 'bg-gradient-to-br from-primary to-accent', borderColor: 'border-primary/20' },
        { name: 'Email', Icon: Mail, status: 'Soon', iconBg: 'bg-gradient-to-br from-orange-500 to-red-500', borderColor: 'border-orange-500/20' },
        { name: 'API', Icon: Code2, status: 'Live', iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500', borderColor: 'border-purple-500/20' },
        { name: 'Mobile', Icon: Smartphone, status: 'Soon', iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500', borderColor: 'border-pink-500/20' },
    ]

    return (
        <section id="integrations" className="relative py-24 md:py-32 overflow-hidden">
            {/* Light beam */}
            <div className="absolute top-0 left-0 right-0 h-px">
                <div className="light-beam" />
                <div className="light-beam-glow -translate-y-8" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="text-sm font-medium text-primary mb-4 block uppercase tracking-wider">Integrations</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Access from anywhere.
                        <br />
                        <span className="text-muted-foreground">Right where you chat.</span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Reminders, todos, team coordination and integrations — your knowledge synchronized across every platform.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left: Circular Feature Menu */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease }}
                        className="relative"
                    >
                        <div className="relative bg-[#0a0a0f] rounded-3xl p-8 sm:p-12 border border-white/5 overflow-hidden">
                            <div className="relative w-full aspect-square max-w-[380px] mx-auto">
                                {/* Center button - Animated */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center relative">
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-primary/30"
                                            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                        />
                                        <AxonIcon size={28} className="text-primary" animated />
                                    </div>
                                    <p className="text-xs text-center mt-2 text-white font-medium">MOM Mode</p>
                                </motion.div>

                                <div className="absolute inset-12 rounded-full border border-white/10" />

                                {[
                                    { icon: Users, label: 'Circles', top: '15%', left: '15%' },
                                    { icon: FileText, label: 'Notes', top: '15%', left: '75%' },
                                    { icon: Zap, label: 'Voice & Image', top: '50%', left: '5%' },
                                    { icon: Globe, label: 'Integrations', top: '50%', left: '85%' },
                                    { icon: Check, label: 'To-Do Lists', top: '85%', left: '25%' },
                                    { icon: Sparkles, label: 'Reminders', top: '85%', left: '65%' },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                                        style={{ top: item.top, left: item.left }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease: "backOut" }}
                                        whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-1 hover:border-primary/30 hover:bg-primary/10 transition-colors">
                                            <item.icon className="w-4 h-4 text-white/70" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Chat Preview + Platform Cards */}
                    <div className="space-y-6">
                        {/* Chat Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-green-900/30 to-green-950/50 rounded-3xl p-6 border border-green-500/20 max-w-[340px] ml-auto">
                                {/* Chat header */}
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                                    <motion.div
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <AxonIcon size={20} className="text-white" />
                                    </motion.div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Axon AI</p>
                                        <div className="flex items-center gap-1">
                                            <motion.div
                                                className="w-1.5 h-1.5 rounded-full bg-green-400"
                                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                            <p className="text-xs text-green-400">online</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat messages */}
                                <div className="space-y-3">
                                    <motion.div
                                        className="flex gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                    >
                                        <div className="bg-[#1a1a1a] rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                                            <p className="text-xs text-white/90 flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5 text-primary" />
                                                <span className="font-medium">Meeting Minutes Mode Activated</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                I'm ready to capture your meeting. Start recording when ready.
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-2 text-right">3:00 PM</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="flex gap-2 justify-end"
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.5 }}
                                    >
                                        <div className="bg-green-600/30 rounded-2xl rounded-tr-sm p-3 flex items-center gap-2">
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Play className="w-4 h-4 text-green-400" />
                                            </motion.div>
                                            <VoiceWaveform />
                                            <span className="text-[10px] text-green-400">0:45</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="flex justify-end"
                                        initial={{ opacity: 0, y: 5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 0.7 }}
                                    >
                                        <div className="bg-primary/20 rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
                                            <Lightbulb className="w-3 h-3 text-primary" />
                                            <span className="text-[10px] text-primary">Try switching apps!</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Input area */}
                                <div className="mt-4 pt-3 border-t border-white/10">
                                    <div className="bg-[#1a1a1a] rounded-full px-4 py-2 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Message Axon...</span>
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                            <Send className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating platform icons */}
                            <div className="absolute -right-2 top-1/4 flex flex-col gap-2">
                                <FloatAnimation delay={0}>
                                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
                                        <MessageSquare className="w-5 h-5 text-white" />
                                    </div>
                                </FloatAnimation>
                                <FloatAnimation delay={0.3}>
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                </FloatAnimation>
                                <FloatAnimation delay={0.6}>
                                    <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-lg">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                </FloatAnimation>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6, ease }}
                    className="text-center mt-10 md:mt-12"
                >
                    <p className="text-sm text-muted-foreground mb-4">
                        Your productivity tools, simplified into a chat. For focus and flow, everywhere.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium btn-secondary rounded-xl"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Try on Web
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}






// CTA Section
export function CTASection() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[600px] h-[300px] bg-primary/15 rounded-full blur-[120px]" />
            </div>

            {/* Light beam */}
            <div className="absolute top-0 left-0 right-0 h-px">
                <div className="light-beam" />
                <div className="light-beam-glow translate-y-4" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="relative z-10 max-w-3xl mx-auto px-6 text-center"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    Ready to amplify
                    <br />
                    <span className="gradient-text-purple">your mind?</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                    Start capturing, connecting, and querying your knowledge today.
                    Your second brain is waiting.
                </p>
                <GradientButton asChild size="lg">
                    <Link href="/dashboard">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </GradientButton>
            </motion.div>
        </section>
    )
}

// Footer
export function Footer() {
    return (
        <footer className="border-t border-border py-12">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <AxonIcon size={28} />
                        <span className="font-semibold font-heading">Axon</span>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-muted-foreground">
                        <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                        <a href="https://github.com" target="_blank" className="hover:text-foreground transition-colors">GitHub</a>
                        <span>© 2024 Axon</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
