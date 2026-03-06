import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { AppIcon } from "@/components/icons/AppIcon";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/components/chat/store";
import { SettingsDialog } from "@/components/chat/SettingsDialog";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";

export function ProjectMenuDropdown({
  projectTitle,
  threadId,
}: {
  projectTitle: string;
  threadId: string;
}) {
  const navigate = useNavigate();
  const store = useChatStore();
  const { tt } = useI18n();
  const thread = store.threads.find((t) => t.id === threadId);

  const { theme, setTheme } = useTheme();
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState("");
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  React.useEffect(() => {
    if (renameOpen) setRenameValue(thread?.title ?? projectTitle);
  }, [projectTitle, renameOpen, thread?.title]);

  const favorite = Boolean(thread?.favorite);
  const favoriteLabel = favorite
    ? tt("Desfavoritar projeto", "Unfavorite project")
    : tt("Favoritar projeto", "Favorite project");

  const applyRename = React.useCallback(() => {
    const next = renameValue.trim();
    if (!next) return;
    store.updateThread(threadId, (t) => ({ ...t, title: next }));
  }, [renameValue, store, threadId]);

  const toggleFavorite = React.useCallback(() => {
    store.updateThread(threadId, (t) => ({ ...t, favorite: !Boolean(t.favorite) }));
  }, [store, threadId]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-9 rounded-[999px] px-4 shadow-none",
              "hover:bg-transparent hover:text-foreground",
              "active:bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "data-[state=open]:bg-transparent",
            )}
          >
            <span className="truncate">{projectTitle}</span>
            <AppIcon name="ChevronDown" className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className={cn("min-w-[260px]", "bg-popover")}
        >
          {/* Sem rótulo no topo — mantém o menu mais limpo e 100% alinhado à esquerda */}

          <DropdownMenuItem onSelect={() => navigate("/")} className="justify-start text-left">
            <AppIcon name="ArrowLeft" className="mr-2 h-4 w-4 opacity-70" />
            {tt("Ir para dashboard", "Go to dashboard")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSettingsOpen(true)} className="justify-start text-left">
            <AppIcon name="Settings" className="mr-2 h-4 w-4 opacity-70" />
            {tt("Configurações", "Settings")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRenameOpen(true)} className="justify-start text-left">
            <AppIcon name="PencilLine" className="mr-2 h-4 w-4 opacity-70" />
            {tt("Renomear projeto", "Rename project")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              toggleFavorite();
            }}
            className="justify-start text-left"
          >
            <AppIcon name="Star" className="mr-2 h-4 w-4 opacity-70" fill={favorite ? "currentColor" : "none"} />
            {favoriteLabel}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="justify-start text-left">
              <AppIcon name="Palette" className="mr-2 h-4 w-4 opacity-70" />
              {tt("Aparência", "Appearance")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-6} sideOffset={10}>
              <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={(v) => setTheme(v)}>
                <DropdownMenuRadioItem value="system">{tt("Sistema", "System")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">{tt("Escuro", "Dark")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">{tt("Claro", "Light")}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            onSelect={() => {
              window.open("https://docs.lovable.dev/", "_blank", "noopener,noreferrer");
            }}
            className="justify-start text-left"
          >
            <AppIcon name="CircleHelp" className="mr-2 h-4 w-4 opacity-70" />
            {tt("Ajuda", "Help")}
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} initialSection="configuracoes" />

      <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
        <AlertDialogContent className="sm:max-w-[500px] p-6 gap-0">
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="text-xl font-medium">{tt("Renomear projeto", "Rename project")}</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-2">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder={tt("Nome do projeto", "Project name")}
              className="h-12 rounded-xl bg-transparent border border-border/60 focus-visible:ring-1 focus-visible:ring-ring/20 focus-visible:ring-offset-0 text-[15px] placeholder:text-muted-foreground/40"
              autoFocus
            />

            <AlertDialogFooter className="mt-4">
              <AlertDialogAction
                className="rounded-full px-6 h-10 bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 shadow-sm"
                onClick={(e) => {
                  // mantém o dialog aberto se estiver vazio
                  if (!renameValue.trim()) {
                    e.preventDefault();
                    return;
                  }
                  applyRename();
                }}
              >
                {tt("Renomear", "Rename")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
