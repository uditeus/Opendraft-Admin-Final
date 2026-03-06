import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AppIcon } from "@/components/icons/AppIcon";
import { useTheme } from "next-themes";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";
import { ThemePicker } from "@/components/chat/ThemePicker";
import { useAuth } from "@/components/auth/AuthProvider";
import { updateUserOnboarding } from "@/lib/supabase/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CircleUser, LogOut, Trash2, KeyRound, ShieldCheck, CreditCard, Users, BookOpen, Settings2, User as UserIcon, Lock, Activity, Sparkles, MessageSquare, Volume2, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { UsageStats } from "@/components/chat/UsageStats";

type SettingsSectionId =
  | "configuracoes"
  | "personalizacao"
  | "seguranca"
  | "conta"
  | "uso"
  | "playbooks"
  | "comunidade"
  | "ajuda"
  // compat (IDs antigos)
  | "geral"
  | "aplicativos"
  | "drafts";

const sections: Array<{
  id: Exclude<SettingsSectionId, "geral" | "aplicativos" | "drafts">;
  labelPt: string;
  labelEn: string;
}> = [
    { id: "conta", labelPt: "Conta", labelEn: "Account" },
    { id: "configuracoes", labelPt: "Configurações", labelEn: "Settings" },
    { id: "personalizacao", labelPt: "Perfil", labelEn: "Profile" },
    { id: "seguranca", labelPt: "Segurança", labelEn: "Security" },
    { id: "uso", labelPt: "Uso", labelEn: "Usage" },
    { id: "playbooks", labelPt: "Playbooks", labelEn: "Playbooks" },
    { id: "comunidade", labelPt: "Comunidade", labelEn: "Community" },
    { id: "ajuda", labelPt: "Ajuda", labelEn: "Help" },
  ];

function normalizeInitialSection(section?: SettingsSectionId): Exclude<SettingsSectionId, "geral" | "aplicativos" | "drafts"> {
  if (!section) return "configuracoes";
  if (section === "geral" || section === "drafts") return "configuracoes";
  if (section === "aplicativos") return "playbooks";
  return section as Exclude<SettingsSectionId, "geral" | "aplicativos" | "drafts">;
}

export function SettingsDialog({
  open,
  onOpenChange,
  initialSection,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: SettingsSectionId;
}) {
  const [active, setActive] = React.useState<Exclude<SettingsSectionId, "geral" | "aplicativos" | "drafts">>("configuracoes");

  const { theme, setTheme } = useTheme();
  const { tt, preference, setPreference } = useI18n();

  const dialogContentRef = React.useRef<HTMLDivElement | null>(null);

  const [language, setLanguage] = React.useState<"auto" | "pt" | "en">("auto");
  const [accent, setAccent] = React.useState<"Azul" | "Branco">("Azul");
  const appearanceLabel = React.useMemo(() => {
    if (theme === "light") return tt("Claro", "Light");
    if (theme === "dark") return tt("Escuro", "Dark");
    return tt("Sistema", "System");
  }, [theme, tt]);

  const { user, signOut } = useAuth();
  // Baseline states (synced with DB)
  const [fullName, setFullName] = React.useState<string>("");
  const [displayName, setDisplayName] = React.useState<string>("");
  const [jobRole, setJobRole] = React.useState<string>("");
  const [about, setAbout] = React.useState<string>("");
  const [responseStyle, setResponseStyle] = React.useState<"Direto" | "Criativo" | "Persuasivo" | "Técnico">("Direto");

  // Draft states (local edits)
  const [draftFullName, setDraftFullName] = React.useState<string>("");
  const [draftDisplayName, setDraftDisplayName] = React.useState<string>("");
  const [draftJobRole, setDraftJobRole] = React.useState<string>("");
  const [draftAbout, setDraftAbout] = React.useState<string>("");

  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const val = window.localStorage.getItem("opendraft_sounds");
    return val === null ? true : val === "true";
  });

  const [notificationsEnabled, setNotificationsEnabled] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const val = window.localStorage.getItem("opendraft_notifications");
    return val === null ? true : val === "true";
  });

  React.useEffect(() => {
    window.localStorage.setItem("opendraft_sounds", String(soundEnabled));
  }, [soundEnabled]);

  React.useEffect(() => {
    window.localStorage.setItem("opendraft_notifications", String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Sync state with user metadata
  React.useEffect(() => {
    if (user?.user_metadata) {
      const fn = user.user_metadata.full_name || "";
      const dn = user.user_metadata.preferred_name || "";
      const jr = user.user_metadata.job_role || "";
      const ab = user.user_metadata.about || "";

      setFullName(fn);
      setDisplayName(dn);
      setJobRole(jr);
      setAbout(ab);

      setDraftFullName(fn);
      setDraftDisplayName(dn);
      setDraftJobRole(jr);
      setDraftAbout(ab);

      if (user.user_metadata.response_style) {
        setResponseStyle(user.user_metadata.response_style);
      }
    }
  }, [user]);

  const hasProfileChanges =
    draftFullName !== fullName ||
    draftDisplayName !== displayName ||
    draftJobRole !== jobRole ||
    draftAbout !== about;

  const resetProfileDrafts = () => {
    setDraftFullName(fullName);
    setDraftDisplayName(displayName);
    setDraftJobRole(jobRole);
    setDraftAbout(about);
  };

  const handleUpdateProfile = async (updates: {
    fullName?: string;
    preferredName?: string;
    jobRole?: string;
    about?: string;
    responseStyle?: string
  }) => {
    if (!user) return;

    const { error } = await import("@/lib/supabase/client").then(m => m.getSupabase().auth.updateUser({
      data: {
        full_name: updates.fullName ?? fullName,
        preferred_name: updates.preferredName ?? displayName,
        job_role: updates.jobRole ?? jobRole,
        about: updates.about ?? about,
        response_style: updates.responseStyle ?? responseStyle
      }
    }));

    if (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    } else {
      toast.success("Perfil atualizado");
    }
  };

  function Row({
    title,
    description,
    value,
  }: {
    title: string;
    description?: string;
    value?: React.ReactNode;
  }) {
    return (
      <div className="flex w-full items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">{title}</div>
          {description ? <div className="mt-0.5 text-xs text-muted-foreground">{description}</div> : null}
        </div>
        {value ? <div className="shrink-0 text-sm text-foreground/90">{value}</div> : <div className="shrink-0" />}
      </div>
    );
  }

  React.useEffect(() => {
    if (open) setActive(normalizeInitialSection(initialSection));
  }, [open, initialSection]);

  React.useEffect(() => {
    setLanguage(preference);
  }, [preference]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          ref={dialogContentRef}
          className={cn(
            "fixed left-[50%] top-[50%] z-50",
            "translate-x-[-50%] translate-y-[-50%]",
            "bg-popover text-foreground shadow-elev-2",
            "p-0",
            "w-[min(820px,calc(100vw-32px))]",
            "h-[min(600px,calc(100vh-32px))]",
            "max-w-none",
            "overflow-hidden",
            "rounded-[28px] border border-border/40",
            // subtle, fast appear (no slide)
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2",
            "duration-200",
          )}
        >
          <DialogPrimitive.Close
            aria-label={tt("Fechar", "Close")}
            className="absolute left-[12px] top-3.5 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 hover:bg-[hsl(var(--chat-hover))] hover:text-foreground transition-all focus:outline-none z-10"
          >
            <AppIcon name="X" className="h-[18px] w-[18px]" strokeWidth={2} />
          </DialogPrimitive.Close>

          <div className="grid h-full grid-cols-[224px_1fr]">
            {/* Left nav */}
            <nav className="bg-[hsl(var(--chat-sidebar))] p-2.5">
              {/* extra gap so the first item ("Geral") sits lower than the close button */}
              <div className="mt-16 space-y-1">
                {sections.map((s) => {
                  const isActive = s.id === active;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActive(s.id)}
                      className={cn(
                        "chat-focus flex w-full items-center rounded-lg px-3 py-2 text-left text-[13px]",
                        isActive
                          ? "bg-[hsl(var(--chat-active))] text-foreground"
                          : "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                      )}
                    >
                      {tt(s.labelPt, s.labelEn)}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Right content */}
            <section className="flex h-full flex-col bg-background">
              {/* push title a bit lower for more vertical breathing room */}
              <DialogHeader className="px-5 pb-4 pt-7">
                <DialogTitle className="text-lg font-semibold">
                  {(() => {
                    const s = sections.find((x) => x.id === active);
                    return s ? tt(s.labelPt, s.labelEn) : "";
                  })()}
                </DialogTitle>
              </DialogHeader>

              <div className="px-5">
                <div className="h-px bg-border/50" />
              </div>

              <div className="min-h-0 flex-1 overflow-auto px-5 pb-5 pt-2">
                <div>
                  {active === "configuracoes" && (
                    <div className="space-y-6">
                      <div>
                        {/* Aparência */}
                        <div className="space-y-3 py-3">
                          <div className="px-1 text-sm font-medium text-foreground">{tt("Aparência", "Appearance")}</div>
                          <ThemePicker />
                        </div>

                        {/* Idioma */}
                        <Select
                          value={language}
                          onValueChange={(v: "auto" | "pt" | "en") => {
                            setLanguage(v);
                            setPreference(v);
                          }}
                        >
                          <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 [&>svg]:hidden focus:ring-0 focus:ring-offset-0 relative rounded-lg py-3 text-left after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50 last:after:hidden">
                            <Row
                              title={tt("Idioma", "Language")}
                              description={tt("Idioma da interface", "Interface language")}
                              value={<SelectValue placeholder={tt("Selecione", "Select")} />}
                            />
                          </SelectTrigger>
                          <SelectContent
                            align="end"
                            position="popper"
                            sideOffset={(() => {
                              const langs = ["auto", "pt", "en"];
                              const idx = langs.indexOf(language);
                              return idx >= 0 ? -(idx * 40 + 44) : -44;
                            })()}
                            collisionBoundary={dialogContentRef.current ?? undefined}
                            className="rounded-xl border-border/40 shadow-elev-3 w-[180px] bg-popover p-1"
                          >
                            <SelectItem value="auto" className="rounded-lg h-9">{tt("Automático", "Auto")}</SelectItem>
                            <SelectItem value="pt" className="rounded-lg h-9">{tt("Português", "Portuguese")}</SelectItem>
                            <SelectItem value="en" className="rounded-lg h-9">{tt("Inglês", "English")}</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Sons e Notificações */}
                        <div className="flex items-center justify-between py-3 relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">{tt("Efeitos sonoros", "Sound effects")}</span>
                            <span className="text-xs text-muted-foreground">{tt("Sons sutis de feedback visual e interações", "Subtle sounds for visual feedback and interactions")}</span>
                          </div>
                          <Switch
                            checked={soundEnabled}
                            onCheckedChange={setSoundEnabled}
                          />
                        </div>

                        <div className="flex items-center justify-between py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">{tt("Notificações", "Notifications")}</span>
                            <span className="text-xs text-muted-foreground">{tt("Alertas de conclusão de tarefas e respostas", "Alerts for task completion and responses")}</span>
                          </div>
                          <Switch
                            checked={notificationsEnabled}
                            onCheckedChange={setNotificationsEnabled}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {active === "personalizacao" && (
                    <div className="space-y-6 pb-20 relative">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 py-1">
                          <label className="text-[12px] font-medium text-foreground">{tt("Nome completo", "Full name")}</label>
                          <Input
                            value={draftFullName}
                            onChange={(e) => setDraftFullName(e.target.value)}
                            placeholder=""
                            className="h-10 rounded-xl bg-muted/5 border-border/40 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 outline-none"
                          />
                        </div>

                        <div className="space-y-1 py-1">
                          <label className="text-[12px] font-medium text-foreground">{tt("Como o Opendraft deveria te chamar?", "What should Opendraft call you?")}</label>
                          <Input
                            value={draftDisplayName}
                            onChange={(e) => setDraftDisplayName(e.target.value)}
                            placeholder=""
                            className="h-10 rounded-xl bg-muted/5 border-border/40 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 py-1">
                        <label className="text-[12px] font-medium text-foreground">{tt("O que melhor descreve seu trabalho?", "What best describes your work?")}</label>
                        <Select
                          value={draftJobRole}
                          onValueChange={setDraftJobRole}
                        >
                          <SelectTrigger className="h-10 w-full rounded-xl text-sm bg-muted/5 border-border/40 focus:ring-0 focus:ring-offset-0 ring-0 outline-none">
                            <SelectValue placeholder={tt("Selecione sua função", "Select your role")} />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            align="start"
                            sideOffset={(() => {
                              const roles = ["Copywriter", "Criador", "Estrategista", "Social Media", "Empreendedor", "Marketing", "Educação", "Outro"];
                              const idx = roles.indexOf(draftJobRole);
                              return idx >= 0 ? -(idx * 40 + 44) : -44;
                            })()}
                            className="rounded-xl border-border/40 shadow-elev-3 w-[var(--radix-select-trigger-width)] bg-popover"
                          >
                            <SelectItem value="Copywriter" className="rounded-lg h-10">{tt("Copywriter / Redator", "Copywriter / Writer")}</SelectItem>
                            <SelectItem value="Criador" className="rounded-lg h-10">{tt("Criador de Conteúdo", "Content Creator")}</SelectItem>
                            <SelectItem value="Estrategista" className="rounded-lg h-10">{tt("Estrategista Digital", "Digital Strategist")}</SelectItem>
                            <SelectItem value="Social Media" className="rounded-lg h-10">{tt("Social Media", "Social Media")}</SelectItem>
                            <SelectItem value="Empreendedor" className="rounded-lg h-10">{tt("Empreendedor / Fundador", "Entrepreneur / Founder")}</SelectItem>
                            <SelectItem value="Marketing" className="rounded-lg h-10">{tt("Marketing / Vendas", "Marketing / Sales")}</SelectItem>
                            <SelectItem value="Educação" className="rounded-lg h-10">{tt("Educação / Estudante", "Education / Student")}</SelectItem>
                            <SelectItem value="Outro" className="rounded-lg h-10">{tt("Outro", "Other")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1 py-1">
                        <label className="text-[12px] font-medium text-foreground">{tt("Quais preferências pessoais o AI deve considerar nas respostas?", "What personal preferences should the AI consider in responses?")}</label>
                        <div className="text-[11px] text-muted-foreground mb-2">
                          {tt("Suas preferências serão aplicadas a todas as conversas", "Your preferences will be applied to all conversations")}
                        </div>
                        <Textarea
                          value={draftAbout}
                          onChange={(e) => setDraftAbout(e.target.value)}
                          placeholder={tt("ex. Escrevo textos para anúncios e criativos de alta conversão focados em vendas direto no Instagram", "e.g. I write high-converting ad copy and creatives focused on direct sales on Instagram")}
                          className="min-h-[140px] resize-none rounded-2xl bg-muted/5 border-border/40 p-4 text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 outline-none"
                        />
                      </div>

                      {hasProfileChanges && (
                        <div className="absolute bottom-0 right-0 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetProfileDrafts}
                            className="text-muted-foreground hover:text-foreground h-9 px-4 rounded-xl"
                          >
                            {tt("Cancelar", "Cancel")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateProfile({
                              fullName: draftFullName,
                              preferredName: draftDisplayName,
                              jobRole: draftJobRole,
                              about: draftAbout
                            })}
                            className="bg-foreground text-background hover:bg-foreground/90 h-9 px-5 rounded-xl font-bold transition-all active:scale-95"
                          >
                            {tt("Salvar alterações", "Save changes")}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {active === "seguranca" && (
                    <div className="space-y-6">
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="chat-focus relative w-full rounded-lg py-3 text-left after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50 last:after:hidden"
                            >
                              <Row title="Alterar senha" description="Atualize sua senha" value="Em breve" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            sideOffset={8}
                            collisionPadding={12}
                            collisionBoundary={dialogContentRef.current ?? undefined}
                          >
                            <DropdownMenuItem onSelect={() => toast.success("Email de redefinição enviado!")}>
                              Redefinir senha
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="chat-focus relative w-full rounded-lg py-3 text-left after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50 last:after:hidden"
                            >
                              <Row
                                title="Autenticação em duas etapas"
                                description="Proteção adicional para sua conta"
                                value="Desativado"
                              />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            sideOffset={8}
                            collisionPadding={12}
                            collisionBoundary={dialogContentRef.current ?? undefined}
                          >
                            <DropdownMenuItem onSelect={() => { }} disabled>
                              Em breve
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="chat-focus relative w-full rounded-lg py-3 text-left after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50 last:after:hidden"
                            >
                              <Row title="Sessões ativas" description="Gerencie dispositivos conectados" value="Visual apenas" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            sideOffset={8}
                            collisionPadding={12}
                            collisionBoundary={dialogContentRef.current ?? undefined}
                          >
                            <DropdownMenuItem onSelect={() => { }} disabled>
                              Visual apenas
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}

                  {active === "uso" && <UsageStats />}

                  {active === "playbooks" && (
                    <div className="space-y-6">
                      <div>
                        <div>
                          <Select defaultValue="Automático">
                            <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 [&>svg]:hidden focus:ring-0 focus:ring-offset-0 relative rounded-lg py-3 text-left after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50 last:after:hidden">
                              <Row title="Modo padrão" description="Como os playbooks iniciam" value={<SelectValue placeholder="Selecione" />} />
                            </SelectTrigger>
                            <SelectContent
                              align="end"
                              position="popper"
                              sideOffset={8}
                              collisionBoundary={dialogContentRef.current ?? undefined}
                              className="rounded-xl border-border/40 shadow-elev-3 w-[180px] bg-popover p-1"
                            >
                              <SelectItem value="Automático" className="rounded-lg h-9">Automático</SelectItem>
                              <SelectItem value="Manual" className="rounded-lg h-9">Manual</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select defaultValue="Sempre">
                            <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 [&>svg]:hidden focus:ring-0 focus:ring-offset-0 relative rounded-lg py-3 text-left after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50 last:after:hidden">
                              <Row title="Salvar histórico" description="Manter histórico de execução" value={<SelectValue placeholder="Selecione" />} />
                            </SelectTrigger>
                            <SelectContent
                              align="end"
                              position="popper"
                              sideOffset={8}
                              collisionBoundary={dialogContentRef.current ?? undefined}
                              className="rounded-xl border-border/40 shadow-elev-3 w-[180px] bg-popover p-1"
                            >
                              <SelectItem value="Sempre" className="rounded-lg h-9">Sempre</SelectItem>
                              <SelectItem value="Nunca" className="rounded-lg h-9">Nunca</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {active === "comunidade" && (
                    <div className="space-y-4">
                      <a
                        href="https://discord.gg/opendraft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-focus block relative w-full rounded-lg py-3 text-left after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50"
                      >
                        <Row
                          title="Discord"
                          description={tt("Participe da nossa comunidade e tire dúvidas", "Join our community and ask questions")}
                          value={tt("Entrar", "Join")}
                        />
                      </a>

                      <a
                        href="https://twitter.com/opendraft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-focus block relative w-full rounded-lg py-3 text-left"
                      >
                        <Row
                          title="Twitter"
                          description={tt("Acompanhe as últimas novidades e recursos", "Follow for the latest news and features")}
                          value={tt("Seguir", "Follow")}
                        />
                      </a>
                    </div>
                  )}

                  {active === "ajuda" && (
                    <div className="space-y-3 py-3">
                      <div className="text-sm text-muted-foreground">
                        {tt("Abra a documentação em uma nova aba", "Open the documentation in a new tab")}
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => window.open("https://docs.opendraft.us/", "_blank", "noopener,noreferrer")}
                        >
                          {tt("Abrir docs", "Open docs")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {active === "conta" && (
                    <div className="space-y-0 text-[13px]">
                      {/* Nome */}
                      <div className="flex items-center justify-between py-4 border-b border-border/10">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground/90">{tt("Nome", "Name")}</span>
                          <span className="text-[12px] text-muted-foreground/60">{tt("Seu nome de perfil", "Your profile name")}</span>
                        </div>
                        <span className="text-foreground/70 font-medium">{fullName || user?.user_metadata?.full_name || "—"}</span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between py-4 border-b border-border/10">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground/90">{tt("E-mail", "Email")}</span>
                          <span className="text-[12px] text-muted-foreground/60">{tt("Seu endereço de e-mail de acesso", "Your login email address")}</span>
                        </div>
                        <span className="text-foreground/70 font-medium">{user?.email || "—"}</span>
                      </div>

                      {/* Logout */}
                      <div className="flex items-center justify-between py-4 border-b border-border/10 transition-all px-2 -mx-2 rounded-lg cursor-pointer" onClick={() => signOut()}>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground/90">{tt("Desconectar dispositivos", "Disconnect devices")}</span>
                          <span className="text-[12px] text-muted-foreground/60">{tt("Sair de todas as sessões ativas", "Logout from all active sessions")}</span>
                        </div>
                        <span className="text-foreground/60 font-semibold transition-colors">{tt("Sair de tudo", "Logout all")}</span>
                      </div>

                      {/* Delete */}
                      <div className="flex items-center justify-between py-4 px-2 -mx-2 rounded-lg opacity-50">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground/90">{tt("Excluir conta", "Delete account")}</span>
                          <span className="text-[12px] text-muted-foreground/60">{tt("Remover permanentemente seus dados", "Permanently remove your data")}</span>
                        </div>
                        <span className="text-foreground/30 font-semibold">{tt("Em breve", "Coming soon")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </DialogPrimitive.Content >
      </DialogPrimitive.Portal >
    </DialogPrimitive.Root >
  );
}
