import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { listProjects } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n/i18n";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { updateProject, deleteProject } from "@/lib/supabase/api";
import { toast } from "sonner";
import { RenameModal } from "@/components/chat/RenameModal";
import { ChatOptionsDropdown } from "@/components/chat/ChatOptionsDropdown";

type ProjectFilter = "todos" | "recentes" | "favoritos";

type ProjectItem = {
  id: string;
  title: string;
  updatedAt: number;
  favorite?: boolean;
};

function formatRelative(updatedAt: number, locale: "pt" | "en") {
  const diff = Date.now() - updatedAt;
  const min = Math.floor(diff / 60000);
  if (min < 60) return locale === "pt" ? `${min} min` : `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return locale === "pt" ? `${h} h` : `${h} h`;
  const d = Math.floor(h / 24);
  return locale === "pt" ? `${d} d` : `${d} d`;
}

function SearchPill({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-full",
        "border border-border/50 bg-background",
        "px-3",
      )}
    >
      <AppIcon name="Search" className="h-4 w-4 shrink-0 opacity-60" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

export default function ProjectsPage() {
  const { tt, locale } = useI18n();
  const { user } = useAuth();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<ProjectFilter>("todos");
  const [items, setItems] = React.useState<ProjectItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    setLoading(true);
    listProjects(user.id, {
      filter: filter === "todos" ? undefined : filter,
      query: query || undefined
    }).then(({ data }: any) => {
      if (data) {
        setItems(data.map((p: any) => ({
          id: p.id,
          title: p.title,
          updatedAt: new Date(p.updated_at).getTime(),
          favorite: p.is_favorite
        })));
      }
      setLoading(false);
    });
  }, [user, filter, query]);

  const updatedLabel = tt("Atualizado há", "Updated");

  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [itemToRename, setItemToRename] = React.useState<{ id: string; title: string } | null>(null);

  const handleRename = (id: string, currentTitle: string) => {
    setItemToRename({ id, title: currentTitle });
    setRenameModalOpen(true);
  };

  const confirmRename = async (newTitle: string) => {
    if (!itemToRename) return;
    try {
      await updateProject(itemToRename.id, { title: newTitle });
      setItems((prev) => prev.map((i) => (i.id === itemToRename.id ? { ...i, title: newTitle } : i)));
      toast.success(tt("Renomeado com sucesso", "Renamed successfully"));
    } catch {
      toast.error(tt("Erro ao renomear", "Error renaming"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(tt("Tem certeza que deseja excluir?", "Are you sure you want to delete?"))) return;
    try {
      await deleteProject(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(tt("Excluído com sucesso", "Deleted successfully"));
    } catch {
      toast.error(tt("Erro ao excluir", "Error deleting"));
    }
  };

  const handleToggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      await updateProject(id, { is_favorite: !currentFavorite });
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, favorite: !currentFavorite } : i)));
      toast.success(currentFavorite ? tt("Removido dos favoritos", "Removed from favorites") : tt("Adicionado aos favoritos", "Added to favorites"));
    } catch {
      toast.error(tt("Erro ao atualizar", "Error updating"));
    }
  };

  const showEmptyState = !loading && items.length === 0 && !query && filter === "todos";

  if (showEmptyState) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center px-5">
        <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-4">
            <AppIcon name="QuillWrite" className="h-12 w-12 text-muted-foreground/40" />
          </div>

          <h3 className="mb-8 text-[24px] font-semibold text-foreground max-w-[320px] leading-tight mx-auto">
            {tt("Comece a escrever sua primeira copy", "Start writing your first copy")}
          </h3>

          <Link to="/new">
            <Button variant="outline" className="h-12 rounded-xl px-8 text-base font-medium border-border/60 hover:bg-accent/50 transition-colors">
              {tt("Começar a escrever", "Start writing")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16">
      <header className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold font-serif">{tt("Biblioteca", "Library")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tt("Veja, encontre e organize seus chats.", "See, find, and organize your chats.")}
            </p>
          </div>

          <div className="w-full max-w-[360px]">
            <SearchPill
              value={query}
              onChange={setQuery}
              placeholder={tt("Buscar chats e projetos", "Search chats and projects")}
            />
          </div>
        </div>

        <section className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as ProjectFilter)}>
            <TabsList className="bg-transparent p-0">
              <TabsTrigger
                value="todos"
                className={cn(
                  "rounded-full px-4 py-2 text-sm",
                  "data-[state=active]:bg-[hsl(var(--chat-active))] data-[state=active]:text-foreground",
                  "data-[state=inactive]:text-muted-foreground",
                )}
              >
                {tt("Todos", "All")}
              </TabsTrigger>
              <TabsTrigger
                value="recentes"
                className={cn(
                  "rounded-full px-4 py-2 text-sm",
                  "data-[state=active]:bg-[hsl(var(--chat-active))] data-[state=active]:text-foreground",
                  "data-[state=inactive]:text-muted-foreground",
                )}
              >
                {tt("Recentes", "Recent")}
              </TabsTrigger>
              <TabsTrigger
                value="favoritos"
                className={cn(
                  "rounded-full px-4 py-2 text-sm",
                  "data-[state=active]:bg-[hsl(var(--chat-active))] data-[state=active]:text-foreground",
                  "data-[state=inactive]:text-muted-foreground",
                )}
              >
                {tt("Favoritos", "Favorites")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>
      </header>

      <main className="mt-10">
        <section aria-label={tt("Lista da biblioteca", "Library list")}>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex h-[72px] w-full items-center justify-between rounded-lg border border-border/50 px-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[140px]" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.03,
                  },
                },
              }}
            >
              {items.length === 0 ? (
                <div className="mt-10 text-sm text-muted-foreground">
                  {tt("Nenhum projeto encontrado.", "No projects found.")}
                </div>
              ) : null}
              {items.map((p, idx) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    to={`/chat/${p.id}`}
                    className={cn(
                      "chat-focus group relative flex w-full items-center justify-between gap-4 rounded-lg py-3 text-left",
                      idx !== items.length - 1 &&
                      "after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">{p.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {updatedLabel} {formatRelative(p.updatedAt, locale)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <ChatOptionsDropdown
                          isFavorite={!!p.favorite}
                          onToggleFavorite={() => handleToggleFavorite(p.id, !!p.favorite)}
                          onRename={() => handleRename(p.id, p.title)}
                          onDelete={() => handleDelete(p.id)}
                          onArchive={() => toast.info("Conversa arquivada (funcionalidade em breve)")}
                          triggerClassName="text-muted-foreground/50 hover:text-foreground"
                        />
                      </div>
                      <AppIcon name="ChevronRight" className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
      <RenameModal
        open={renameModalOpen}
        onOpenChange={setRenameModalOpen}
        title={itemToRename?.title || ""}
        onRename={confirmRename}
      />
    </div>
  );
}
