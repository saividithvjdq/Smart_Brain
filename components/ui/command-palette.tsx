"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Search, Command, FileText, Brain, MessageSquare, ArrowRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "./glowing-effect";

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // GSAP Animation for opening/closing
    useEffect(() => {
        if (!overlayRef.current || !containerRef.current) return;

        if (isOpen) {
            // Fluid kinetic entrance
            gsap.fromTo(
                overlayRef.current,
                { clipPath: "circle(0% at 50% 10%)", opacity: 0 },
                { clipPath: "circle(150% at 50% 50%)", opacity: 1, duration: 0.6, ease: "power3.inOut" }
            );

            gsap.fromTo(
                containerRef.current,
                { y: -50, scale: 0.95, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.5, delay: 0.2, ease: "back.out(1.5)" }
            );

            // Focus input
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            gsap.to(containerRef.current, { y: -20, scale: 0.95, opacity: 0, duration: 0.3, ease: "power2.in" });
            gsap.to(overlayRef.current, {
                clipPath: "circle(0% at 50% 10%)",
                opacity: 0,
                duration: 0.5,
                delay: 0.1,
                ease: "power3.inOut"
            });
        }
    }, [isOpen]);

    return (
        <>
            {/* Trigger Button (Optional visible trigger) */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-muted-foreground transition-colors group"
            >
                <Search className="w-4 h-4" />
                <span>Search your brain...</span>
                <div className="flex items-center gap-0.5 ml-4 px-1.5 py-0.5 rounded bg-background border border-white/10 text-[10px] font-mono group-hover:border-primary/30 transition-colors">
                    <span>⌘</span>
                    <span>K</span>
                </div>
            </button>

            {/* Overlay */}
            <div
                ref={overlayRef}
                className={cn(
                    "fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4",
                    !isOpen && "pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            >
                <div
                    ref={containerRef}
                    className="relative w-full max-w-2xl bg-[#0B0914] border border-primary/20 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Active Glow */}
                    <GlowingEffect blur={20} spread={30} glow={true} variant="purple" />

                    <div className="relative z-10 flex flex-col">
                        {/* Input Header */}
                        <div className="flex items-center px-4 py-4 border-b border-primary/20 bg-background/50">
                            <Search className="w-5 h-5 text-primary mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search notes, ask a question, or type a command..."
                                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-lg"
                            />
                            <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-muted-foreground">
                                ESC
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                {/* Suggestions Section */}
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
                                        Quick Actions
                                    </h4>
                                    <div className="grid gap-2">
                                        {[
                                            { icon: Brain, label: "Ask Axon AI a question", shortcut: "A" },
                                            { icon: FileText, label: "Create a new note", shortcut: "N" },
                                            { icon: MessageSquare, label: "Open Chat Interface", shortcut: "C" },
                                        ].map((action, i) => (
                                            <button key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                        <action.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium">{action.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span>Return to select</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Items Section */}
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
                                        Recent Knowledge
                                    </h4>
                                    <div className="grid gap-2">
                                        {[
                                            { icon: FileText, label: "Project Orion Specifications", type: "Note" },
                                            { icon: Globe, label: "React 19 Hooks Guide", type: "Web Clip" },
                                            { icon: Brain, label: "LLM Fine-tuning Concepts", type: "Insight" },
                                        ].map((item, i) => (
                                            <button key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm">{item.label}</span>
                                                        <span className="text-[10px] text-muted-foreground">{item.type}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-white/5 bg-background/80 flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">↑</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">↓</span>
                                    <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">↵</span>
                                    <span>Select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium text-primary/70">
                                <Command className="w-3.5 h-3.5" />
                                <span>Kinetic Search Array</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
