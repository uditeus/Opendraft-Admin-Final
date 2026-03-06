import React from "react";
import { motion } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

interface SuggestionPillsProps {
    suggestions: string[];
    onSelect: (text: string) => void;
    visible: boolean;
}

export function SuggestionPills({ suggestions, onSelect, visible }: SuggestionPillsProps) {
    if (!visible || !suggestions || suggestions.length === 0) return null;

    return (
        <div className="flex w-full flex-wrap gap-2 px-0 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            {suggestions.map((text, idx) => (
                <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(text)}
                    className={cn(
                        "flex items-center h-8 px-3 rounded-lg transition-all duration-150 group",
                        "bg-[#e9ecef] text-[#3c3c3c] hover:bg-[#dee2e6] shadow-sm",
                        "dark:bg-[#252528] dark:text-[#d1d1d1] dark:hover:bg-[#2f2f32] dark:shadow-none"
                    )}
                >
                    <span className="text-[13px] font-medium truncate max-w-[320px]">
                        {text}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
