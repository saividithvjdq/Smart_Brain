'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/firebase/auth-context'
import { PlusCircle, Search, MessageSquare, Sparkles, ArrowRight, X } from 'lucide-react'
import { AxonIcon } from '@/components/ui/icons'
import Link from 'next/link'

const steps = [
    {
        title: 'Welcome to Axon',
        description: 'Your AI-powered second brain. Let\'s get you started in 30 seconds.',
        icon: AxonIcon,
        color: 'from-primary to-accent',
    },
    {
        title: 'Capture your thoughts',
        description: 'Save notes, links, and insights. Axon auto-tags and summarizes everything.',
        icon: PlusCircle,
        color: 'from-blue-500 to-blue-600',
        action: { label: 'Try Capture', href: '/dashboard/capture' },
    },
    {
        title: 'Ask your AI',
        description: 'Chat with your knowledge base. Axon finds relevant notes and answers questions.',
        icon: MessageSquare,
        color: 'from-violet-500 to-violet-600',
        action: { label: 'Try Chat', href: '/dashboard/chat' },
    },
    {
        title: 'Search & connect',
        description: 'Find anything instantly. Axon surfaces connections between your ideas.',
        icon: Search,
        color: 'from-emerald-500 to-emerald-600',
        action: { label: 'Try Search', href: '/dashboard/search' },
    },
]

export function OnboardingGuide() {
    const { user, getIdToken } = useAuth()
    const [currentStep, setCurrentStep] = useState(0)
    const [show, setShow] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if onboarding has been shown before (local storage fallback)
        const onboardingDone = localStorage.getItem('axon-onboarding-complete')
        if (!onboardingDone && user) {
            setShow(true)
        }
    }, [user])

    const handleComplete = async () => {
        setDismissed(true)
        localStorage.setItem('axon-onboarding-complete', 'true')

        // Also update Firestore via API
        try {
            const token = await getIdToken()
            if (token) {
                await fetch('/api/user/onboarding', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ onboardingComplete: true }),
                })
            }
        } catch {
            // Silent fail — local storage already tracks it
        }
    }

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    if (!show || dismissed) return null

    const step = steps[currentStep]
    const StepIcon = step.icon

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                    {/* Top gradient */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`} />

                    {/* Close */}
                    <button
                        onClick={handleComplete}
                        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="p-8">
                        {/* Icon */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                        >
                            <StepIcon size={28} className="text-white" />
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            key={`content-${currentStep}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <h2 className="text-xl font-bold font-heading mb-2">{step.title}</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                        </motion.div>

                        {/* Action link */}
                        {'action' in step && step.action && (
                            <Link
                                href={step.action.href}
                                onClick={handleComplete}
                                className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary hover:underline font-medium"
                            >
                                {step.action.label}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-8">
                            {/* Progress dots */}
                            <div className="flex gap-2">
                                {steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentStep(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentStep
                                                ? 'bg-primary w-6'
                                                : i < currentStep
                                                    ? 'bg-primary/50'
                                                    : 'bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Next / Finish */}
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                            >
                                {currentStep === steps.length - 1 ? (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Get Started
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
