"use client";

import { motion } from "framer-motion";
import { Brain, FileText, Globe, Search, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { AxonIcon } from "./icons";

export function RadialOrbitalTimeline({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-full max-w-3xl mx-auto aspect-square flex items-center justify-center overflow-hidden py-12", className)}>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl opacity-50" />

            {/* Outer Orbit */}
            <motion.div
                className="absolute w-[80%] h-[80%] rounded-full border border-primary/10 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                <OrbitNode icon={Globe} label="Web Capture" angle={0} orbitSize="100%" color="border-primary/20 hover:border-primary/50" />
                <OrbitNode icon={MessageSquare} label="Chat Integration" angle={120} orbitSize="100%" color="border-primary/20 hover:border-primary/50" />
                <OrbitNode icon={FileText} label="Notes & Files" angle={240} orbitSize="100%" color="border-primary/20 hover:border-primary/50" />
            </motion.div>

            {/* Inner Orbit */}
            <motion.div
                className="absolute w-[45%] h-[45%] rounded-full border border-primary/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                <OrbitNode icon={Search} label="Semantic Search" angle={60} orbitSize="100%" color="border-blue-500/30 text-blue-400 bg-blue-500/10" reverse />
                <OrbitNode icon={Brain} label="AI Processing" angle={180} orbitSize="100%" color="border-purple-500/30 text-purple-400 bg-purple-500/10" reverse />
                <OrbitNode icon={Sparkles} label="Generate Insights" angle={300} orbitSize="100%" color="border-pink-500/30 text-pink-400 bg-pink-500/10" reverse />
            </motion.div>

            {/* Core */}
            <div className="absolute w-24 h-24 rounded-full bg-[#110C24] border-2 border-primary shadow-[0_0_50px_rgba(115,80,255,0.4)] flex items-center justify-center z-10">
                <AxonIcon size={42} className="text-white" animated />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-30" style={{ animationDuration: '3s' }} />
            </div>
        </div>
    );
}

function OrbitNode({
    icon: Icon,
    label,
    angle,
    orbitSize,
    color = "border-white/10",
    reverse = false
}: {
    icon: any,
    label: string,
    angle: number,
    orbitSize: string,
    color?: string,
    reverse?: boolean
}) {
    // Convert angle to position on a circle
    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(calc(${orbitSize} / 2)) rotate(-${angle}deg)`,
            }}
        >
            <motion.div
                className={cn("relative flex flex-col items-center group", reverse && "rotate-180", !reverse && "transform")}
                animate={{ rotate: reverse ? 360 : -360 }}
                transition={{ duration: reverse ? 40 : 60, repeat: Infinity, ease: "linear" }}
            >
                <div className={cn("w-14 h-14 rounded-full bg-[#0B0914] border shadow-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:scale-110 cursor-default", color)}>
                    <Icon className="w-6 h-6 relative z-10" />
                    <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>
                <div className="absolute top-full mt-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 shadow-xl whitespace-nowrap pointer-events-none text-xs font-semibold text-foreground z-20">
                    {label}
                </div>
            </motion.div>
        </div>
    );
}
