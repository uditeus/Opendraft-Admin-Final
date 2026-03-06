import * as React from "react";
import { toast } from "sonner";
import { AppIcon } from "@/components/icons/AppIcon";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

import { useI18n } from "@/i18n/i18n";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ThemePicker } from "@/components/chat/ThemePicker";
import { KeyboardShortcutsDialog } from "@/components/chat/KeyboardShortcutsDialog";
import { SettingsDialog } from "@/components/chat/SettingsDialog";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { ReportBugDialog } from "@/components/chat/ReportBugDialog";
import { AffiliateDialog } from "@/components/chat/AffiliateDialog";
import { cn } from "@/lib/utils";

export function UserAvatarDropdown({
  className,
}: {
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const { tt } = useI18n();
  const { user, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const navigate = useNavigate();
  const [bugDialogOpen, setBugDialogOpen] = React.useState(false);
  const [affiliateOpen, setAffiliateOpen] = React.useState(false);

  // Reset tooltip when menu closes
  React.useEffect(() => {
    if (menuOpen) {
      setTooltipOpen(false);
    }
  }, [menuOpen]);

  const [settingsInitialSection, setSettingsInitialSection] = React.useState<
    React.ComponentProps<typeof SettingsDialog>["initialSection"]
  >("geral");

  const name = user?.user_metadata?.full_name || tt("Usuário", "User");

  const avatarSrc = user?.user_metadata?.avatar_url || "";

  // V1 Visual: Mock credits
  const credits = 5;
  const maxCredits = 10;


  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <ChatTooltip
          label={tt("Conta", "Account")}
          open={menuOpen ? false : tooltipOpen}
          onOpenChange={setTooltipOpen}
        >
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={tt("Abrir menu da conta", "Open account menu")}
              className={cn("rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarSrc} alt={name} />
                <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
        </ChatTooltip>

        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={10}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
          className={cn(
            "w-[320px] p-2",
            "rounded-2xl overflow-hidden",
            "bg-popover",
          )}
        >




          {/* Balance (visual-only) */}
          {/* Credits Section */}
          {/* Turn Pro Banner */}
          {/* Turn Pro Banner */}
          {/* Turn Pro Banner */}

          {/* Turn Pro Banner */}
          <div className="mb-2 flex items-center justify-between rounded-xl bg-muted/50 p-3">
            <span className="text-sm font-semibold pl-1">Seja Pro</span>
            <Button
              size="sm"
              className="h-7 border-0 px-3 text-xs font-bold"
              onClick={() => navigate("/pricing")}
            >
              Assinar
            </Button>
          </div>

          {/* Credits Section */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            {credits > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Créditos</span>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                    <span className="text-xs text-muted-foreground">{credits} left</span>
                    <AppIcon name="ChevronRight" className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <Progress value={(credits / maxCredits) * 100} className="h-2" />
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  Recarrega diariamente à meia-noite
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sem créditos</span>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                    <span className="text-xs text-muted-foreground">0 left</span>
                    <AppIcon name="ChevronRight" className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            )}
          </div>

          <DropdownMenuSeparator className="my-2" />

          {/* Settings */}
          <DropdownMenuItem
            onSelect={() => {
              setSettingsInitialSection("configuracoes");
              setSettingsOpen(true);
            }}
          >
            <AppIcon name="Settings" className="opacity-70" />
            {tt("Configurações", "Settings")}
          </DropdownMenuItem>

          {/* Appearance Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <AppIcon name="Palette" className="opacity-70" />
              {tt("Aparência", "Appearance")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-6} sideOffset={10} className="w-64 p-2">
              <ThemePicker />
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Affiliate Program */}
          <DropdownMenuItem
            onSelect={() => setAffiliateOpen(true)}
          >
            <AppIcon name="Star" className="opacity-70" />
            {tt("Programa de Afiliados", "Affiliate program")}
          </DropdownMenuItem>

          {/* Help Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <AppIcon name="CircleHelp" className="opacity-70" />
              {tt("Ajuda", "Help")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-8} sideOffset={10} className="w-[320px] px-2 py-2">
              <DropdownMenuItem onClick={() => window.open("https://docs.opendraft.us", "_blank")}>
                <AppIcon name="BookOpen" className="opacity-70" />
                Central de Ajuda
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setBugDialogOpen(true)}>
                <AppIcon name="Bug" className="opacity-70" />
                Informar bug
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShortcutsOpen(true)}>
                <AppIcon name="Keyboard" className="opacity-70" />
                Atalhos de teclado
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open("https://opendraft.us/contact", "_blank")}>
                <AppIcon name="MessageCircle" className="opacity-70" />
                Fale conosco
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive"
            onSelect={handleSignOut}
          >
            <AppIcon name="LogOut" className="opacity-70" />
            {tt("Sair", "Sign out")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} initialSection={settingsInitialSection} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <ReportBugDialog open={bugDialogOpen} onOpenChange={setBugDialogOpen} />
      <AffiliateDialog open={affiliateOpen} onOpenChange={setAffiliateOpen} />
    </>
  );
}
