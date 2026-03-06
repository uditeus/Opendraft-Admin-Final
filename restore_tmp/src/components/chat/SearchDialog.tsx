import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";

import { AppIcon } from "@/components/icons/AppIcon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";

type RecentItem = {
  id: string;
  title: string;
  group?: string;
};

export function SearchDialog({
  open,
  onOpenChange,
  recents,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recents: RecentItem[];
  onPick?: (id: string) => void;
}) {
  const { tt } = useI18n();
  const [query, setQuery] = React.useState("");
  const hasRecents = recents.length > 0;

  React.useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* No backdrop darkening/blur; only used to capture outside click */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-transparent data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50",
            "translate-x-[-50%] translate-y-[-50%]",
            "w-[min(520px,calc(100vw-40px))]",
            // dynamic height: compact when there are many recents; readable min-height when empty
            hasRecents ? "max-h-[420px]" : "min-h-[240px]",
            "max-w-none",
            "overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-elev-2",
            // subtle, fast appear
            "transition-[transform,opacity] ease-out",
            "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
            "data-[state=open]:scale-100 data-[state=closed]:scale-[0.98]",
            "data-[state=open]:duration-150 data-[state=closed]:duration-100",
          )}
        >
          <Command
            className={cn(
              "h-full w-full rounded-none bg-popover text-popover-foreground",
              // tighten + standardize item layout (chat design system)
              "[&_[cmdk-list]]:max-h-none",
              "[&_[cmdk-item]]:rounded-lg",
              "[&_[cmdk-item]]:px-3",
              "[&_[cmdk-item]]:py-3",
              "[&_[cmdk-item]]:text-[13px]",
              "[&_[cmdk-item][data-selected='true']]:bg-[hsl(var(--chat-hover))]",
              "[&_[cmdk-group-heading]]:px-3",
              "[&_[cmdk-group-heading]]:py-2",
              "[&_[cmdk-group-heading]]:text-[12px]",
              "[&_[cmdk-group-heading]]:font-medium",
              "[&_[cmdk-group-heading]]:text-muted-foreground",
            )}
          >
            {/* Header (taller input + subtle divider) */}
            <div className="flex h-14 items-center gap-2 border-b border-border/30 px-4" cmdk-input-wrapper="">
              <AppIcon name="Search" className="h-4 w-4 shrink-0 opacity-60" />
              <CommandPrimitive.Input
                value={query}
                onValueChange={setQuery}
                placeholder={tt("Buscar em chats...", "Search chats...")}
                className="h-12 w-full bg-transparent py-3 text-[13px] outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <DialogPrimitive.Close
                aria-label={tt("Fechar", "Close")}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground focus:outline-none"
              >
                <AppIcon name="X" className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            <CommandList
              className={cn(
                "overflow-auto p-2",
                hasRecents ? "max-h-[calc(420px-56px)]" : "min-h-[calc(240px-56px)]",
              )}
            >
              <CommandEmpty className="py-6 text-center text-[13px] text-muted-foreground">
                {tt("Nenhum resultado.", "No results.")}
              </CommandEmpty>

              <CommandGroup heading="">
                <CommandItem
                  value="new chat"
                  onSelect={() => {
                    onOpenChange(false);
                    onPick?.("new");
                  }}
                  className="text-[13px]"
                >
                  {tt("Novo chat", "New chat")}
                </CommandItem>
              </CommandGroup>

              {hasRecents ? (
                <>
                  <CommandSeparator className="bg-border/30" />
                  <CommandGroup heading={tt("Recentes", "Recents")}>
                    {recents.map((r) => (
                      <CommandItem
                        key={r.id}
                        value={r.title}
                        onSelect={() => {
                          onOpenChange(false);
                          onPick?.(r.id);
                        }}
                      >
                        {r.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : (
                <div className="px-2 pb-4 pt-3">
                  <div className="rounded-xl bg-[hsl(var(--chat-hover))]/30 p-4">
                    <div className="text-[13px] font-medium text-foreground">
                      {tt("Sem projetos recentes", "No recent projects")}
                    </div>
                    <div className="mt-1 text-[12px] text-muted-foreground">
                      {tt("Crie um projeto para ele aparecer aqui.", "Create a project and it will show up here.")}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        onPick?.("new");
                      }}
                      className="mt-3 inline-flex h-9 items-center rounded-lg bg-[hsl(var(--chat-active))] px-3 text-[13px] text-foreground"
                    >
                      {tt("Criar projeto", "Create project")}
                    </button>
                  </div>
                </div>
              )}
            </CommandList>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
