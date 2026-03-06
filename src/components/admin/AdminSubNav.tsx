import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SubNavItem {
    label: string;
    path: string;
}

interface AdminSubNavProps {
    items: SubNavItem[];
}

export function AdminSubNav({ items }: AdminSubNavProps) {
    const location = useLocation();

    return (
        <div className="flex mb-6 -mx-2 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-1.5 px-2">
                {items.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex h-9 items-center rounded-full px-4 text-[13px] font-medium transition-all duration-200",
                                active
                                    ? "bg-[hsl(var(--chat-active))] text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
