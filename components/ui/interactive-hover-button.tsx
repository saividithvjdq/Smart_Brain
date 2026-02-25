import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export const InteractiveHoverButton = React.forwardRef<
    HTMLButtonElement,
    InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "group relative w-auto cursor-pointer overflow-hidden rounded-xl border border-border bg-background/50 backdrop-blur-sm p-2 px-6 h-12 text-center font-medium text-foreground hover:bg-muted/50 hover:border-primary/50 transition-colors",
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-center gap-2 transition-transform duration-300 group-hover:-translate-x-3">
                <span>{children}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-end px-5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 text-primary">
                <ArrowRight size={18} />
            </div>
        </button>
    );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
