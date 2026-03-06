import { cn } from "@/lib/utils";

interface ShimmeringTextProps {
    children: React.ReactNode;
    className?: string;
    shimmerWidth?: number;
}

export function ShimmeringText({
    children,
    className,
    shimmerWidth = 100,
}: ShimmeringTextProps) {
    return (
        <span
            className={cn(
                "mx-auto max-w-md text-neutral-600/50 dark:text-neutral-400/50",

                // Shimmer effect
                "animate-shimmer bg-clip-text bg-no-repeat [background-size:var(--shimmer-width)_100%]",

                // Gradient
                "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80",

                className
            )}
            style={
                {
                    "--shimmer-width": `${shimmerWidth}px`,
                } as React.CSSProperties
            }
        >
            {children}
        </span>
    );
}

export default ShimmeringText;
