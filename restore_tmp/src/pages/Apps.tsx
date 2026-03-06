import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useChatStore } from "@/components/chat/store";
import { listPlaybooks } from "@/lib/supabase/api";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";
import { motion } from "framer-motion";

import { AppCard } from "./apps/AppCard";
import { apps as localApps, categories, type AppCategory, type AppItem } from "./apps/appsData";



export default function AppsPage() {
  const { tt } = useI18n();
  const { user } = useAuth();
  const store = useChatStore();
  const [query, setQuery] = React.useState("");
  const [skills, setSkills] = React.useState<AppItem[]>(localApps);

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((a) => {
      if (!q) return true;
      return `${a.name} ${a.description}`.toLowerCase().includes(q);
    });
  }, [query, skills]);

  const handleSkillClick = async (item: AppItem) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Create project with skill
    try {
      const threadId = await store.createThread(item.id, item.name);
      navigate(`/workspace/${threadId}`);
    } catch (err) {
      console.error("Failed to create thread", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16">
      <header className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold">{tt("Playbooks", "Playbooks")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tt(
                "Explore playbooks prontos e use como ponto de partida para criar a sua.",
                "Explore ready-made playbooks and use them as a starting point to create your own.",
              )}
            </p>
          </div>

          <div className="w-full max-w-[360px]">
            <div
              className={cn(
                "flex h-10 items-center gap-2 rounded-full",
                "border border-border/50 bg-background",
                "px-3",
              )}
            >
              <AppIcon name="Search" className="h-4 w-4 shrink-0 opacity-60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tt("Buscar playbooks", "Search playbooks")}
                className="h-10 w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

      </header>


      <main className="mt-10">
        <section aria-label={tt("Lista de playbooks", "Playbooks list")}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
            className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((it) => (
              <motion.div
                key={it.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.96 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <AppCard item={it} onClick={() => handleSkillClick(it)} />
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 ? (
            <div className="mt-10 text-sm text-muted-foreground">{tt("Nenhum playbook encontrado.", "No playbooks found.")}</div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
