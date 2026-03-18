import React from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "@/components/icons/AppIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/components/chat/store";
import { ComposerSurvey } from "./ComposerSurvey";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { ComposerQuestionnaire, type QuestionnaireData } from "@/components/chat/ComposerQuestionnaire";
import { SlashCommandMenu, type SlashCommand } from "@/components/chat/SlashCommandMenu";
import { BriefingQualityBar } from "@/components/chat/BriefingQualityBar";
import { sounds } from "@/lib/audio/sounds";

function getExt(name: string) {
  return name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1).toUpperCase();
}

const AttachmentItem = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const isImage = file.type.startsWith("image/");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  const handleInteract = () => {
    if (isImage) {
      setIsPreviewOpen(true);
    } else {
      const url = preview || URL.createObjectURL(file);
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <div className="group relative flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all hover:shadow-md animate-in fade-in zoom-in-75 duration-200">
        <button
          type="button"
          onClick={handleInteract}
          className="h-full w-full pointer-events-auto"
          title="Visualizar"
        >
          {isImage && preview ? (
            <img src={preview} alt={file.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center text-muted-foreground">
              <AppIcon name="FileText" className="h-6 w-6 opacity-30" strokeWidth={1.5} />
              <span className="mt-1 max-w-full truncate text-[8px] font-semibold uppercase tracking-wider text-foreground/50">
                {getExt(file.name)}
              </span>
            </div>
          )}
        </button>

        <div className="absolute right-1.5 top-1.5 z-10 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto">
          <ChatTooltip label="Remover" side="top">
            <button
              type="button"
              onClick={onRemove}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-sm hover:scale-105 hover:bg-red-50 hover:text-red-500"
              aria-label="Remover"
            >
              <AppIcon name="X" className="h-[10px] w-[10px]" strokeWidth={2.5} />
            </button>
          </ChatTooltip>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="!left-0 !top-0 !m-0 !max-w-none !translate-x-0 !translate-y-0 flex h-[100dvh] w-screen items-center justify-center border-none bg-transparent p-0 shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Visualização de Imagem</DialogTitle>
          <DialogDescription className="sr-only">Esta é a imagem em tamanho real</DialogDescription>
          {preview && (
            <div
              className="relative flex h-full w-full flex-col items-center justify-center p-8 focus:outline-none"
              onClick={() => setIsPreviewOpen(false)}
            >
              <img
                src={preview}
                alt={file.name}
                className="h-auto w-auto max-h-[90vh] max-w-full rounded-md object-contain cursor-default select-none shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.preventDefault()}
              />
              <div
                className="absolute top-6 right-6 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <ChatTooltip label="Fechar" side="bottom">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-zinc-300 shadow-xl hover:bg-black hover:text-white transition-all outline-none"
                    aria-label="Fechar"
                  >
                    <AppIcon name="X" className="h-[18px] w-[18px]" />
                  </button>
                </ChatTooltip>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  selectedAgent,
  onSelectAgent,
  mode,
  onTogglePlan,
  onToggleHighlight,
  highlightEnabled,
  showShiftHint,
  workspaceActionsPlacement,
  uiVariant,
  contextPill,
  onAttach,
  selectedStyle,
  onSelectStyle,
  activePill,
  onSelectPill,
  activationOrder,
  questionnaire,
  onQuestionnaireComplete,
  onQuestionnaireCancel,
  className,
  forceActiveStyle,
  dropdownSide = "top",
  isGenerating: isGeneratingProp,
  attachments,
  onRemoveAttachment,
  playbookContext,
  isDark,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
  selectedAgent?: null | "write" | "explore" | "plan" | "analyze";
  onSelectAgent?: (agent: null | "write" | "explore" | "plan" | "analyze") => void;
  mode?: "dashboard" | "workspace";
  onTogglePlan?: () => void;
  onToggleHighlight?: () => void;
  highlightEnabled?: boolean;
  showShiftHint?: boolean;
  workspaceActionsPlacement?: "composer" | "header";
  uiVariant?: "default" | "hero";
  contextPill?: null | {
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    onClear: () => void;
  };
  playbookContext?: { label: string; onClear: () => void } | null;
  isDark?: boolean;
  onAttach?: (files: File[]) => void;
  selectedStyle?: string | null;
  onSelectStyle?: (style: string | null) => void;
  activePill?: string | null;
  onSelectPill?: (pill: string | null) => void;
  activationOrder?: ("style" | "pill" | "playbook" | "agent")[];
  questionnaire?: QuestionnaireData | null;
  onQuestionnaireComplete?: (answers: Record<string, string[]>) => void;
  onQuestionnaireCancel?: () => void;
  className?: string;
  forceActiveStyle?: boolean;
  dropdownSide?: "top" | "bottom";
  attachments?: File[];
  onRemoveAttachment?: (index: number) => void;
}) {
  // Command menus: anchor to the typed character (text start), so the menu appears more to the right.
  const COMMAND_MENU_ALIGN_OFFSET_PX = 0;
  const COMMAND_ANCHOR_LEFT_NO_PLUS_PX = 16; // textarea pl-4
  const COMMAND_ANCHOR_LEFT_WITH_PLUS_PX = 74; // tuned: plus button + gap + textarea text start

  const navigate = useNavigate();
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const { activeSurvey, startSurvey, threads, stopGeneration } = useChatStore();
  const currentPath = window.location.pathname;
  const threadIdFromUrl = currentPath.startsWith('/chat/') ? currentPath.split('/')[2] : null;
  const thread = threads.find(t => t.id === threadIdFromUrl);
  const isGenerating = isGeneratingProp ?? thread?.isTyping;


  // If survey is open, we might want to hide the standard composer or just render the survey "over" it?
  // Requirements: "o composer aumenta sua altura para cima... acoplado a ele".
  // "Enquanto o questionário estiver aberto: O composer fica travado para digitação normal".

  if (activeSurvey && activeSurvey.isOpen) {
    return (
      <div className={cn("w-full p-4 transition-all duration-300 ease-in-out", className)}>
        <ComposerSurvey />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!value.trim() && fileInputRef.current?.files?.length === 0) return;

    // --- MOCK SURVEY TRIGGER ---
    if (value.trim().toLowerCase().includes("criativo para anúncio") || value.trim() === "/survey") {
      startSurvey([
        {
          id: "niche",
          title: "Qual é o nicho ou segmento do seu negócio/projeto?",
          type: "single",
          options: ["E-commerce/Vendas", "Serviços profissionais", "Educação/Cursos", "Saúde e bem-estar", "Entretenimento/Lifestyle"],
          allowOther: true
        },
        {
          id: "platform",
          title: "Para qual plataforma é este anúncio?",
          type: "multi",
          options: ["Instagram/Facebook (Meta)", "TikTok", "YouTube Shorts", "LinkedIn", "Google Ads"],
          allowOther: true
        }
      ], { originalPrompt: value });
      onChange(""); // Clear input
      return; // Don't send yet
    }

    if (e.target.files && e.target.files.length > 0) {
      onAttach?.(Array.from(e.target.files));
    }
    // Reset value so same file can be selected again if needed
    if (e.target) e.target.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleScreenshotClick = async () => {
    try {
      // Chrome/Edge implementation using getDisplayMedia
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as any,
        audio: false,
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;

      // Wait for stream to be active
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      // Simple delay to ensure frame is available
      await new Promise((r) => setTimeout(r, 500));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" });
            onAttach?.([file]);
          }

          // Stop all tracks
          stream.getTracks().forEach(t => t.stop());
        }, "image/png");
      } else {
        stream.getTracks().forEach(t => t.stop());
      }
    } catch (err) {
      console.error("Screenshot failed or cancelled", err);
    }
  };
  const [atMenuOpen, setAtMenuOpen] = React.useState(false);
  const atOpen = value.startsWith("@");

  React.useEffect(() => {
    // @ menu: only when '@' is the FIRST character
    setAtMenuOpen(atOpen);
  }, [atOpen]);

  // --- Slash Command Detection ---
  const slashMatch = value.match(/^\/([\w\sáéíóúãõâêôç]*)?$/);
  const slashOpen = !!slashMatch;
  const slashFilter = slashMatch ? (slashMatch[1] || "") : "";

  const handleSlashSelect = (cmd: SlashCommand) => {
    onChange(cmd.insertText);
    taRef.current?.focus();
  };

  React.useEffect(() => {
    const el = taRef.current;
    if (!el) return;

    // Reset height to calculate correctly
    el.style.height = "auto";

    // Calculate max height for 10 lines. 
    // leading-6 is 24px per line. 10 lines = 240px.
    const MAX_LINES = 10;
    const LINE_HEIGHT = 24;
    const maxHeight = MAX_LINES * LINE_HEIGHT;

    // Apply new height
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;

    // Enable scroll if content exceeds 10 lines
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value]);



  const canSend = value.trim().length > 0 && !disabled && !isGenerating;

  const isWorkspace = mode === "workspace";
  const isHero = true; // Always use hero-style rendering for consistent UI
  const hideShiftHintByAgent =
    selectedAgent === "explore" ||
    selectedAgent === "write" ||
    selectedAgent === "analyze" ||
    selectedAgent === "plan";
  const shouldShowShiftHint = showShiftHint ?? !hideShiftHintByAgent;

  const textareaMinH = "min-h-[92px]";
  const placeWorkspaceActionsInHeader = workspaceActionsPlacement === "header";

  // Reference-style (Manus-like) icon buttons for the hero composer.
  const HERO_ICON_BUTTON_CLASS =
    "bg-transparent text-foreground/80 hover:text-foreground hover:bg-foreground/10 h-9 w-9 rounded-full transition-colors";
  const HERO_ICON_SVG_CLASS = "[&_svg]:size-5";

  const { tt } = useI18n();

  const agents = React.useMemo(
    () =>
      [
        { id: "write" as const, label: tt("Escrever copy", "Write copy"), Icon: AppIcon },
        { id: "explore" as const, label: tt("Explorar", "Explore"), Icon: AppIcon },
        { id: "plan" as const, label: tt("Plano", "Plan"), Icon: AppIcon },
        { id: "analyze" as const, label: tt("Analisar", "Analyze"), Icon: AppIcon },
      ] as const,
    [tt],
  );

  const activeAgent = selectedAgent ? agents.find((a) => a.id === selectedAgent) : null;

  const placeholderLabel =
    placeholder ?? (activeAgent ? tt("Descreva uma tarefa", "Describe a task") : tt("Pergunte algo", "Ask anything"));

  const atItems = React.useMemo(
    () =>
      [
        { id: "products", label: tt("Pesquisa de produtos", "Product research") },
        { id: "canva", label: "Canva", badge: "C" },
        { id: "year", label: tt("Seu ano com o ChatGPT", "Your year with ChatGPT"), badge: "S" },
        { id: "acrobat", label: "Adobe Acrobat", badge: "A" },
        { id: "express", label: "Adobe Express", badge: "A" },
      ] as const,
    [tt],
  );

  const renderAtMenu = (anchorLeftPx: number) => (
    <DropdownMenu open={atMenuOpen} onOpenChange={(next) => setAtMenuOpen(next)}>
      <DropdownMenuTrigger asChild>
        <span aria-hidden className="pointer-events-none absolute top-[8px] h-9 w-9" style={{ left: anchorLeftPx }} />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          side={dropdownSide}
          align="start"
          sideOffset={4}
          alignOffset={COMMAND_MENU_ALIGN_OFFSET_PX}
          className={cn(
            "w-[248px] z-[100]",
            "rounded-2xl border border-border bg-popover shadow-elev-1",
            "p-1.5",
            isDark && "dark",
          )}
        >
          {/* Keep the same overall height as '+' by matching item count + separators */}
          <DropdownMenuItem className="gap-3 rounded-xl px-3 py-1.5 text-[13px]">
            <AppIcon name="Search" className="h-5 w-5 opacity-80" />
            <span>{tt("Pesquisa de produtos", "Product research")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-0.5 h-px bg-border/40" />

          {atItems
            .filter((i) => i.id !== "products")
            .map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="flex items-center gap-3 rounded-xl px-3 py-1.5 text-[13px]"
                onSelect={() => {
                  setAtMenuOpen(false);
                  onChange(`@${item.label} `);
                }}
              >
                <span
                  aria-hidden
                  className="grid h-4 w-4 place-items-center rounded-full bg-[hsl(var(--chat-active))] text-[10px] font-semibold text-foreground/80"
                >
                  {(item as { badge: string }).badge}
                </span>
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}

          <DropdownMenuItem className="gap-3 rounded-xl px-3 py-1.5 text-[13px]">
            <AppIcon name="MoreHorizontal" className="h-5 w-5 opacity-80" />
            <span className="flex-1">{tt("Mais", "More")}</span>
            <AppIcon name="ChevronRight" className="h-4 w-4 opacity-70" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );

  const renderPlusMenu = (buttonClassName?: string) => {
    return (
      <DropdownMenu>
        <ChatTooltip label={tt("Adicionar arquivos ou fotos", "Add files or photos")}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="chatIcon"
              size="chatIcon"
              className={cn(
                "shrink-0",
                "data-[state=open]:bg-[hsl(var(--chat-hover))] data-[state=open]:text-foreground",
                buttonClassName,
              )}
              aria-label={tt("Adicionar opções", "Add options")}
            >
              <AppIcon name="Plus" className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </ChatTooltip>
        <DropdownMenuPortal>
          <DropdownMenuContent
            side={dropdownSide}
            align="start"
            sideOffset={14}
            alignOffset={-6}
            className={cn(
              "w-[248px] z-[100]",
              "rounded-2xl border border-border bg-popover shadow-elev-1",
              "p-1.5",
              isDark && "dark",
            )}
          >
            <DropdownMenuItem
              className="gap-3 rounded-xl px-3 py-1.5 text-[13px]"
              onClick={handleUploadClick}
            >
              <AppIcon name="Paperclip" className="h-5 w-5 opacity-80" />
              <span>{tt("Adicionar arquivos ou fotos", "Add files or photos")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 rounded-xl px-3 py-1.5 text-[13px]"
              onClick={handleScreenshotClick}
            >
              <AppIcon name="Camera" className="h-5 w-5 opacity-80" />
              <span>{tt("Fazer captura de tela", "Take a screenshot")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 h-px bg-border/40" />
            <DropdownMenuItem
              className="gap-3 rounded-xl px-3 py-1.5 text-[13px]"
              onSelect={() => onSelectAgent?.("plan")}
            >
              <AppIcon name="PlanMode" className="h-5 w-5 opacity-80" />
              <span>{tt("Plano", "Plan")}</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-3 rounded-xl px-3 py-1.5 text-[13px]">
                <AppIcon name="QuillWrite" className="h-5 w-5 opacity-80" />
                <span className="flex-1">{tt("Usar estilo", "Use style")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  className={cn(
                    "w-[248px] max-h-[172px] overflow-y-auto no-scrollbar rounded-2xl border border-border bg-popover p-1.5 shadow-elev-2",
                    isDark && "dark"
                  )}
                  sideOffset={8}
                  alignOffset={window.location.pathname.includes('/chat') ? -70 : -6}
                >
                  {[
                    "Normal", "Aprendizado", "Conciso", "Explicativo", "Formal", "Humanizado",
                    "Scientific Persuader", "Joe Karbo", "Claude Hopkins", "David Ogilvy",
                    "Victor Schwab", "John Caples", "Gary Halbert", "Eugene Schwartz",
                    "Lilian Eichler", "Matty Furey", "Ben Settle", "Joseph Sugarman",
                    "Victor O. Schwab", "Dan Kennedy", "Mel Martin", "John Carlton",
                    "Bob Bly", "Doug Danna", "Clayton Makepeace", "Drayton Bird",
                    "Gary Bencivenga", "Robert Collier", "Leo Burnett", "Brian Clark",
                    "Gary Provost", "Jay Abraham", "Jim Rutz"
                  ].map((style) => (
                    <DropdownMenuItem
                      key={style}
                      className="flex h-[32px] cursor-default select-none items-center gap-3 rounded-xl px-3 py-0 text-[13px] outline-none"
                      onSelect={() => onSelectStyle?.(style)}
                    >
                      <AppIcon name="QuillWrite" className="h-[18px] w-[18px] shrink-0 opacity-80" />
                      <span className="truncate">{style}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              className="gap-3 rounded-xl px-3 py-1.5 text-[13px]"
              onClick={() => navigate("/playbooks")}
            >
              <AppIcon name="Cards02Icon" className="h-5 w-5 opacity-80" />
              <span>{tt("Explorar playbooks", "Explore playbooks")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    );
  };

  const renderStyleIndicator = () => {
    if (!selectedStyle) return null;
    return (
      <ChatTooltip label={selectedStyle}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            type="button"
            onClick={() => onSelectStyle?.(null)}
            className={cn(
              "group flex h-9 w-9 items-center justify-center transition-colors",
              "text-[#0066ff] hover:bg-[#0066ff]/10 rounded-full"
            )}
            aria-label={`Remover estilo: ${selectedStyle}`}
          >
            <AppIcon name="QuillWrite" className="h-5 w-5" />
          </button>
        </motion.div>
      </ChatTooltip>
    );
  };

  const renderPillIndicator = () => {
    if (!contextPill) return null;
    const { label, Icon, onClear } = contextPill;
    return (
      <ChatTooltip label={label}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "group flex h-9 w-9 items-center justify-center transition-colors",
              "text-[#0066ff] hover:bg-[#0066ff]/10 rounded-full"
            )}
            aria-label={`Remover: ${label}`}
          >
            <Icon className="h-5 w-5" />
          </button>
        </motion.div>
      </ChatTooltip>
    );
  };

  const renderAgentIndicator = () => {
    if (!activeAgent) return null;
    return (
      <ChatTooltip label={activeAgent.label}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            type="button"
            onClick={() => onSelectAgent?.(null)}
            className={cn(
              "group flex h-9 w-9 items-center justify-center transition-colors",
              "text-[#0066ff] hover:bg-[#0066ff]/10 rounded-full"
            )}
            aria-label={`Remover ${activeAgent.label}`}
          >
            <AppIcon name={
              activeAgent.id === "write" ? "QuillWrite" :
                activeAgent.id === "explore" ? "BrainIcon" :
                  activeAgent.id === "plan" ? "PlanMode" :
                    "Table2"
            } className="h-5 w-5" />
          </button>
        </motion.div>
      </ChatTooltip>
    );
  };

  const renderPlaybookIndicator = () => {
    if (!playbookContext) return null;
    const { label, onClear } = playbookContext;
    return (
      <ChatTooltip label={label}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "group flex h-9 w-9 items-center justify-center transition-colors",
              "text-[#0066ff] hover:bg-[#0066ff]/10 rounded-full"
            )}
            aria-label={label}
          >
            <AppIcon name="Cards02Icon" className="h-5 w-5" />
          </button>
        </motion.div>
      </ChatTooltip>
    );
  };

  const renderIndicators = () => {
    if (!activationOrder || activationOrder.length === 0) {
      return (
        <>
          {renderStyleIndicator()}
          {renderPillIndicator()}
          {renderPlaybookIndicator()}
          {renderAgentIndicator()}
        </>
      );
    }

    return activationOrder.map((type) => {
      if (type === "style") return <React.Fragment key="style">{renderStyleIndicator()}</React.Fragment>;
      if (type === "pill") return <React.Fragment key="pill">{renderPillIndicator()}</React.Fragment>;
      if (type === "playbook") return <React.Fragment key="playbook">{renderPlaybookIndicator()}</React.Fragment>;
      if (type === "agent") return <React.Fragment key="agent">{renderAgentIndicator()}</React.Fragment>;
      return null;
    });
  };



  /* Speech Recognition Logic */
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);
  const onChangeRef = React.useRef(onChange); // Keep fresh reference
  const startTextRef = React.useRef(""); // Store text before dictation starts

  // Update ref on every render
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);


  const toggleDictation = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      sounds.playEnd();
      setIsListening(false);
      return;
    }

    sounds.playStart();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = true; // Get results faster
    recognition.continuous = true;

    recognition.onstart = () => {
      // Capture current text and add a space if needed
      const current = taRef.current?.value || "";
      const spacer = current && !current.endsWith(" ") ? " " : "";
      startTextRef.current = current + spacer;
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("Dictation ended");
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      // Reconstruct the full transcript from this session
      // event.results contains all results since recognition.start()
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");

      if (transcript) {
        // Always replace from the start point + full session transcript
        onChangeRef.current(startTextRef.current + transcript);
      }
    };

    recognition.onerror = (event: any) => {
      // Ignore 'no-speech' errors as they are common
      if (event.error === 'no-speech') return;

      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        alert("Microfone bloqueado. Permita o acesso para ditar.");
      }
      setIsListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Failed to start recognition", err);
    }
  };

  return (
    <div className="pointer-events-auto">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
      <div className="w-full chat-container">
        {questionnaire ? (
          <ComposerQuestionnaire
            data={questionnaire}
            onComplete={(answers) => onQuestionnaireComplete?.(answers)}
            onCancel={() => onQuestionnaireCancel?.()}
          />
        ) : (
          <div className="relative">

            {/* Slash Command Menu (floating above) */}
            <SlashCommandMenu
              open={slashOpen}
              filterText={slashFilter}
              onSelect={handleSlashSelect}
              onClose={() => onChange("")}
            />

            {/* Briefing Quality Bar (above composer) */}
            {selectedAgent === "write" && value.trim().length >= 10 && (
              <BriefingQualityBar text={value} />
            )}

            <div
              className={cn(
                "rounded-[26px] border border-border dark:border-none bg-[hsl(var(--chat-composer))] shadow-elev-1",
                "min-h-[132px] w-full flex flex-col",
              )}
            >
              <div className="relative w-full px-3 py-3 flex-1 flex flex-col">
                {renderAtMenu(COMMAND_ANCHOR_LEFT_WITH_PLUS_PX)}

                {attachments && attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 pt-1 pb-1 pointer-events-auto">
                    {attachments.map((file, i) => (
                      <AttachmentItem key={i} file={file} onRemove={() => onRemoveAttachment?.(i)} />
                    ))}
                  </div>
                )}

                <div
                  className="px-1 flex-1 flex flex-col min-h-0 cursor-text justify-start"
                  onClick={() => taRef.current?.focus()}
                >
                  <textarea
                    ref={taRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholderLabel}
                    className={cn(
                      "chat-scroll block w-full resize-none bg-transparent px-3 pb-2 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground",
                      attachments && attachments.length > 0 ? "mt-1" : "mt-4",
                      "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                      "min-h-0",
                    )}
                    rows={1}
                    disabled={disabled}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (canSend) {
                          sounds.playSent();
                          onSubmit();
                        }
                      }
                    }}
                  />
                  {/* Bottom row: icons (inside the bar) */}
                  <div className="flex items-center justify-between px-2 mt-auto pb-1">
                    <div className={cn("flex items-center gap-1", HERO_ICON_SVG_CLASS)}>
                      {renderPlusMenu(HERO_ICON_BUTTON_CLASS)}
                      {renderIndicators()}
                    </div>

                    <div className={cn("flex items-center gap-1", HERO_ICON_SVG_CLASS)}>
                      <ChatTooltip label={isListening ? "Parar" : "Ditar"}>
                        <Button
                          variant="chatIcon"
                          size="chatIcon"
                          aria-label="Ditar"
                          onClick={toggleDictation}
                          className={cn("shrink-0", HERO_ICON_BUTTON_CLASS, isListening && "text-red-500 bg-red-500/10 animate-pulse")}
                        >
                          <AppIcon name="Mic" />
                        </Button>
                      </ChatTooltip>

                      <Button
                        variant="chatPrimary"
                        size="chatIcon"
                        className={cn(
                          "rounded-full",
                          "bg-[hsl(var(--chat-send-bg))] text-[hsl(var(--chat-send-fg))]",
                          "hover:bg-[hsl(var(--chat-send-bg)/0.92)]",
                          "disabled:bg-[hsl(var(--chat-send-bg)/0.6)] disabled:text-[hsl(var(--chat-send-fg)/0.5)]",
                        )}
                        onClick={() => {
                          if (isGenerating && threadIdFromUrl) {
                            stopGeneration(threadIdFromUrl);
                          } else {
                            sounds.playSent();
                            onSubmit();
                          }
                        }}
                        disabled={!isGenerating && !canSend}
                        aria-label={isGenerating ? tt("Parar", "Stop") : tt("Enviar", "Send")}
                        title={isGenerating ? tt("Parar", "Stop") : tt("Enviar", "Send")}
                      >
                        {isGenerating ? (
                          <div className="h-3 w-3 bg-current rounded-sm" />
                        ) : (
                          <AppIcon name="ArrowUp02Icon" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
