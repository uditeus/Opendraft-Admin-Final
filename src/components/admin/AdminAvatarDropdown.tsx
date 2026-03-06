import * as React from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppIcon } from "@/components/icons/AppIcon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { cn } from "@/lib/utils";

export function AdminAvatarDropdown({ collapsed }: { collapsed?: boolean }) {
    const { user, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [tooltipOpen, setTooltipOpen] = React.useState(false);

    React.useEffect(() => {
        if (menuOpen) setTooltipOpen(false);
    }, [menuOpen]);

    const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";
    const avatarSrc = user?.user_metadata?.avatar_url || "";
    const initials = name.charAt(0).toUpperCase();

    const avatarBtn = (
        <button
            type="button"
            aria-label="Opções"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <Avatar className="h-8 w-8">
                <AvatarImage src={avatarSrc} alt={name} />
                <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
                    {initials}
                </AvatarFallback>
            </Avatar>
        </button>
    );

    return (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            {collapsed ? (
                <ChatTooltip
                    label="Opções"
                    side="right"
                    align="center"
                    sideOffset={10}
                    open={menuOpen ? false : tooltipOpen}
                    onOpenChange={setTooltipOpen}
                >
                    <DropdownMenuTrigger asChild>{avatarBtn}</DropdownMenuTrigger>
                </ChatTooltip>
            ) : (
                <DropdownMenuTrigger asChild>{avatarBtn}</DropdownMenuTrigger>
            )}

            <DropdownMenuContent
                align={collapsed ? "start" : "end"}
                side={collapsed ? "right" : "top"}
                sideOffset={10}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="w-[200px] rounded-xl p-2 bg-popover"
            >
                {/* Appearance */}
                <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 pb-1">
                    Aparência
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                        <AppIcon name="Sun" className="opacity-70" />
                        Claro
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        <AppIcon name="Moon" className="opacity-70" />
                        Escuro
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                        <AppIcon name="SlidersHorizontal" className="opacity-70" />
                        Sistema
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator className="my-1" />

                {/* Back to app */}
                <DropdownMenuItem onClick={() => { window.location.href = "/"; }}>
                    <AppIcon name="ArrowLeft" className="opacity-70" />
                    Voltar ao app
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
