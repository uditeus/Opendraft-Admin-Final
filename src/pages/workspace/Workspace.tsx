import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";

import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatThreadView } from "@/components/chat/ChatThreadView";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/components/chat/store";
import { ProjectMenuDropdown } from "@/pages/workspace/ProjectMenuDropdown";
import { useI18n } from "@/i18n/i18n";
import { toast } from "sonner";

function nowId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function createWorkspaceFallback(page1Title: string) {
  const pageId = nowId();
  return {
    pages: [{ id: pageId, title: page1Title, content: "" }],
    activePageId: pageId,
    highlightEnabled: false,
  };
}

function streamText(setter: (next: string) => void, full: string) {
  let i = 0;
  const tick = () => {
    i = Math.min(full.length, i + 14);
    setter(full.slice(0, i));
    if (i < full.length) window.setTimeout(tick, 18);
  };
  tick();
}

function normalizeNiceTitle(input: string) {
  const s = input
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/^'|'$/g, "")
    .replace(/\s+/g, " ");
  if (!s) return "";
  return s[0]!.toUpperCase() + s.slice(1);
}

function toTitleCaseMax3Words(input: string) {
  const normalized = normalizeNiceTitle(input);
  const words = normalized
    .split(" ")
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""));
  return words.join(" ");
}



function generateProjectTitle(thread?: { title?: string; messages?: Array<{ role: string; content?: string }> }, plan?: any) {
  const rawTitle = (thread?.title ?? "").trim();
  const isDefaultTitle =
    !rawTitle ||
    rawTitle === "Projeto" ||
    rawTitle === "Project" ||
    rawTitle === "Nova conversa" ||
    rawTitle === "New chat" ||
    rawTitle === "Boas-vindas" ||
    rawTitle === "Welcome" ||
    rawTitle === "Rascunho de ideias" ||
    rawTitle === "Idea draft";

  if (!isDefaultTitle) return rawTitle;

  const seed =
    (typeof plan?.offer === "string" && plan.offer.trim()) ||
    (typeof plan?.objective === "string" && plan.objective.trim()) ||
    thread?.messages?.find((m) => m.role === "user" && (m.content ?? "").trim())?.content ||
    "";

  const cleaned = toTitleCaseMax3Words(
    seed
      .split("\n")[0]!
      .replace(/^copy\s*(para)?\s*/i, "")
      .replace(/^[\-–—:\s]+/, "")
      .trim(),
  );

  return cleaned || "Seu Projeto";
}

export default function WorkspacePage() {
  const { id } = useParams();
  const store = useChatStore();
  const { tt } = useI18n();

  const threadId = id ?? store.activeThreadId;
  const thread = store.threads.find((t) => t.id === threadId);
  const ws = store.workspaces[threadId];

  React.useEffect(() => {
    if (threadId) store.setActiveThreadId(threadId);
    if (!store.workspaces[threadId]) store.getOrCreateWorkspace(threadId);
    store.loadThreadData(threadId);
  }, [store, threadId]);

  const effectiveWs = ws ?? createWorkspaceFallback(tt("Página 1", "Page 1"));

  const [draft, setDraft] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [chatMinimized, setChatMinimized] = React.useState(false);

  const activePage =
    effectiveWs.pages.find((p) => p.id === effectiveWs.activePageId) ?? effectiveWs.pages[0];

  const lastPlan = React.useMemo(() => {
    const msgs = thread?.messages ?? [];
    for (let i = msgs.length - 1; i >= 0; i--) {
      const m = msgs[i];
      if (m.role === "assistant" && m.type === "plan" && m.data) return m.data;
    }
    return null;
  }, [thread?.messages]);

  const projectTitle = React.useMemo(
    () => generateProjectTitle(thread as any, lastPlan as any),
    [thread, lastPlan],
  );

  const setPageContent = React.useCallback(
    (content: string) => {
      store.setWorkspace(threadId, (prev) => ({
        ...prev,
        pages: prev.pages.map((p) => (p.id === prev.activePageId ? { ...p, content } : p)),
      }));
    },
    [store, threadId],
  );

  const toggleHighlight = React.useCallback(() => {
    store.setWorkspace(threadId, (prev) => ({ ...prev, highlightEnabled: !prev.highlightEnabled }));
  }, [store, threadId]);

  const generatePlanInWorkspace = React.useCallback(() => {
    store.upsertPlanMessage(threadId, {
      angle: tt("Clareza + simplicidade", "Clarity + simplicity"),
      structure: tt("Hook → Dor → Oferta → Prova → CTA", "Hook → Pain → Offer → Proof → CTA"),
      audience: tt(
        "Público-alvo não especificado (sugestão: definir persona)",
        "Target audience not specified (suggestion: define a persona)",
      ),
      offer: tt("Oferta a definir (benefício + condição)", "Offer to define (benefit + condition)"),
      objective: tt("Objetivo a definir", "Objective to define"),
    });
  }, [store, threadId, tt]);

  const send = React.useCallback(async () => {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    setTyping(true);

    try {
      await store.submitMessage(threadId, text);
    } catch (e) {
      console.error(e);
      toast.error("Erro no chat: " + (e instanceof Error ? e.message : "Erro desconhecido"));
    } finally {
      setTyping(false);
    }
  }, [draft, store, threadId, typing]);

  const copyDocument = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activePage?.content ?? "");
    } catch {
      // ignore
    }
  }, [activePage?.content]);

  const createNewPage = React.useCallback(() => {
    const pageId = nowId();
    store.setWorkspace(threadId, (prev) => ({
      ...prev,
      pages: [...prev.pages, { id: pageId, title: `${tt("Página", "Page")} ${prev.pages.length + 1}`, content: "" }],
      activePageId: pageId,
    }));
  }, [store, threadId, tt]);

  const goPrevPage = React.useCallback(() => {
    store.setWorkspace(threadId, (prev) => {
      const idx = prev.pages.findIndex((p) => p.id === prev.activePageId);
      const nextIdx = Math.max(0, idx - 1);
      return { ...prev, activePageId: prev.pages[nextIdx]?.id ?? prev.activePageId };
    });
  }, [store, threadId]);

  const goNextPage = React.useCallback(() => {
    store.setWorkspace(threadId, (prev) => {
      const idx = prev.pages.findIndex((p) => p.id === prev.activePageId);
      const nextIdx = Math.min(prev.pages.length - 1, idx + 1);
      return { ...prev, activePageId: prev.pages[nextIdx]?.id ?? prev.activePageId };
    });
  }, [store, threadId]);

  const ChatHeaderControls = React.useMemo(() => {
    // Controles simples: apenas alternam entre abrir/fechar o painel do chat.
    if (!chatMinimized) {
      return (
        <div className="flex items-center gap-1">
          <ChatTooltip label={tt("Ver histórico", "View history")}>
            <Button
              variant="chatIcon"
              size="chatIcon"
              className="h-9 w-9"
              aria-label={tt("Ver histórico", "View history")}
              onClick={() => { }}
            >
              <AppIcon name="History" />
            </Button>
          </ChatTooltip>
          <ChatTooltip label={tt("Fechar chat", "Close chat")}>
            <Button
              variant="chatIcon"
              size="chatIcon"
              className="h-9 w-9"
              aria-label={tt("Fechar chat", "Close chat")}
              onClick={() => setChatMinimized(true)}
            >
              <AppIcon name="PanelLeft" />
            </Button>
          </ChatTooltip>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <ChatTooltip label={tt("Ver histórico", "View history")}>
          <Button
            variant="chatIcon"
            size="chatIcon"
            className="h-9 w-9"
            aria-label={tt("Ver histórico", "View history")}
            onClick={() => { }}
          >
            <AppIcon name="History" />
          </Button>
        </ChatTooltip>
        <ChatTooltip label={tt("Abrir chat", "Open chat")}>
          <Button
            variant="chatIcon"
            size="chatIcon"
            className="h-9 w-9"
            aria-label={tt("Abrir chat", "Open chat")}
            onClick={() => setChatMinimized(false)}
          >
            <AppIcon name="PanelLeft" />
          </Button>
        </ChatTooltip>
      </div>
    );
  }, [chatMinimized]);

  return (
    <div className="h-full w-full bg-background text-foreground">
      {/* Barra de tarefas (topo) */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative mx-auto flex h-10 w-full items-center">
          {/* Área do documento (esquerda) */}
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <div className="flex min-w-0 items-center gap-2">
              <ProjectMenuDropdown projectTitle={projectTitle} threadId={threadId} />
            </div>
          </div>

          {/* Área do chat (direita) — com divisor até o topo */}
          <div
            className={cn(
              "h-full shrink-0 border-l border-border/60",
              "w-[576px] max-w-xl",
              chatMinimized ? "hidden" : "block",
            )}
          />
        </div>
      </header>

      {/* Corpo: documento no centro, chat fixo à direita */}
      <div className="flex h-[calc(100vh-40px)] w-full">
        <main className="flex h-full min-w-0 flex-1 flex-col">

          <div className="chat-scroll flex-1 overflow-auto bg-background">
            <div className="h-full w-full px-3 pt-1 pb-3">
              {/* Documento no mesmo fundo (sem “página em cima de outra”) */}
              <div className="h-full">
                <div className="mx-auto w-full max-w-[760px] px-6 py-10">
                  <header className="space-y-5">
                    <h1 className="text-[34px] font-medium leading-[1.15] tracking-[-0.01em] text-foreground">
                      {activePage?.title ?? tt("Documento", "Document")}
                    </h1>

                    {lastPlan ? (
                      <div className="text-sm leading-6 text-foreground">
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium">{tt("Ângulo:", "Angle:")}</span> {lastPlan.angle}
                          </div>
                          <div>
                            <span className="font-medium">{tt("Estrutura:", "Structure:")}</span> {lastPlan.structure}
                          </div>
                          <div>
                            <span className="font-medium">{tt("Público:", "Audience:")}</span> {lastPlan.audience}
                          </div>
                          <div>
                            <span className="font-medium">{tt("Oferta:", "Offer:")}</span> {lastPlan.offer}
                          </div>
                          <div>
                            <span className="font-medium">{tt("Objetivo:", "Objective:")}</span> {lastPlan.objective}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </header>

                  <div
                    className={cn(
                      "mt-8 whitespace-pre-wrap text-left text-[14px] leading-6 text-foreground",
                      effectiveWs.highlightEnabled &&
                      "[&_.hl]:bg-[hsl(var(--chat-active)/0.18)] [&_.hl]:px-1 [&_.hl]:rounded",
                    )}
                  >
                    {effectiveWs.highlightEnabled ? (
                      <>
                        <span className="hl">{(activePage?.content ?? "").split("\n")[0] ?? ""}</span>
                        {"\n" + (activePage?.content ?? "").split("\n").slice(1).join("\n")}
                      </>
                    ) : (
                      activePage?.content ?? ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside
          className={cn(
            "h-full shrink-0 border-l border-border/60 bg-background",
            // mesma largura do chat padrão (max-w-xl = 576px)
            "w-[576px] max-w-xl",
            chatMinimized ? "hidden" : "flex",
          )}
        >
          <div className="flex h-full w-full flex-col">
            <div className="flex-1 min-h-0">
              <ChatThreadView threadId={threadId} messages={thread?.messages ?? []} isTyping={typing} />
            </div>

            {/* Composer (mesmo acabamento do chat padrão) */}
            <div className="sticky bottom-0 z-10 w-full bg-background/80 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent" />
              <ChatComposer
                mode="workspace"
                showShiftHint={false}
                value={draft}
                onChange={setDraft}
                onSubmit={send}
                disabled={typing}
                onTogglePlan={generatePlanInWorkspace}
                onToggleHighlight={toggleHighlight}
                highlightEnabled={effectiveWs.highlightEnabled}
                workspaceActionsPlacement="header"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
