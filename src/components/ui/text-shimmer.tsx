import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ShimmeringText from "@/components/ui/shimmering-text";

const PHRASES_BY_MODE: Record<string, string[]> = {
    default: [
        "Thinking deeply...",
        "Mapping the structure...",
        "Connecting ideas...",
        "Structuring your copy...",
        "Refining the angle...",
        "Breaking down the strategy...",
        "Organizing the narrative...",
        "Clarifying the message...",
        "Aligning tone and intent...",
        "Designing the persuasion flow..."
    ],
    write: [
        "Writing your draft...",
        "Crafting the hook...",
        "Shaping the story...",
        "Building momentum...",
        "Strengthening the argument...",
        "Expanding your idea...",
        "Polishing the message...",
        "Adding persuasive elements...",
        "Turning ideas into words...",
        "Composing your copy...",
        "Almost there...",
        "Finalizing details...",
        "Refining the final draft...",
        "Optimizing impact...",
        "Enhancing clarity...",
        "Adding finishing touches...",
        "Preparing final output...",
        "Wrapping things up...",
        "Getting everything ready...",
        "Delivering your result..."
    ],
    ideas: [
        "Thinking deeply...",
        "Mapping the structure...",
        "Connecting ideas...",
        "Structuring your copy...",
        "Refining the angle...",
        "Breaking down the strategy...",
        "Organizing the narrative...",
        "Clarifying the message...",
        "Aligning tone and intent...",
        "Designing the persuasion flow..."
    ],
    analyze: [
        "Analyzing your text...",
        "Reviewing structure...",
        "Evaluating clarity...",
        "Checking emotional triggers...",
        "Identifying improvement points...",
        "Measuring persuasion strength...",
        "Scanning for gaps...",
        "Improving flow and rhythm...",
        "Detecting weak spots...",
        "Strengthening positioning..."
    ],
    plan: [
        "Planning the framework...",
        "Outlining the structure...",
        "Defining key points...",
        "Mapping the journey...",
        "Setting strategic direction...",
        "Organizing next steps...",
        "Building your roadmap...",
        "Creating execution plan...",
        "Structuring content flow...",
        "Aligning objectives..."
    ],
    generating: [
        "Generating response..."
    ]
};

interface TextShimmerProps {
    className?: string;
    mode?: string;
    children?: React.ReactNode;
}

export function TextShimmer({ className, mode = "default", children }: TextShimmerProps) {
    const phrases = PHRASES_BY_MODE[mode] || PHRASES_BY_MODE.default;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 2500); // 2.5 seconds per phrase
        return () => clearInterval(interval);
    }, [phrases.length]);

    if (children) {
        return (
            <div className={cn("flex items-center justify-start", className)}>
                <ShimmeringText className="text-sm font-medium mx-0 text-left">
                    {children}
                </ShimmeringText>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center justify-start w-full", className)}>
            <div className="relative h-6 overflow-hidden min-w-[300px] w-full text-left">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-start"
                    >
                        <ShimmeringText className="text-sm font-medium mx-0 text-left">
                            {phrases[index]}
                        </ShimmeringText>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
