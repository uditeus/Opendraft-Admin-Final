import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-[hsl(var(--chat-hover))] hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[hsl(var(--chat-hover))] hover:text-foreground",
        ghost: "hover:bg-[hsl(var(--chat-hover))] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // Chat-style controls (UI clone)
        chatGhost: "text-foreground/80 hover:bg-[hsl(var(--chat-hover))] hover:text-foreground",
        chatIcon:
          "chat-icon-halo rounded-full text-foreground/80 hover:bg-[hsl(var(--chat-hover))] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        chatPrimary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/85 disabled:bg-muted disabled:text-muted-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",

        chatIcon: "h-9 w-9",
        chatIconSm: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handlePointerUp: React.PointerEventHandler<HTMLButtonElement> = (e) => {
      props.onPointerUp?.(e);
      // UX polish: prevent "sticky" focus/hover visuals after clicking chat controls.
      // Keep keyboard accessibility intact (pointer events won't run for keyboard activation).
      if (!asChild && !e.defaultPrevented) {
        const isChatVariant =
          variant === "chatIcon" || variant === "chatGhost" || variant === "chatPrimary";
        if (isChatVariant) e.currentTarget.blur();
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        // Only attach when we control the underlying button element.
        onPointerUp={asChild ? props.onPointerUp : handlePointerUp}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
