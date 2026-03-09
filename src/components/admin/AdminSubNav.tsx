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
        <div className="flex -mx-4 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex px-4 border-b border-border/10 w-full">
                {items.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex h-12 items-center px-6 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border-b-2 -mb-[2px]",
                                active
                                    ? "border-foreground text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground/80"
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
