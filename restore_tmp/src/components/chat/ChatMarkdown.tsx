import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Check } from "@/components/icons/lucide";

function useCopyButton() {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }, []);

  return { copied, copy };
}

export function ChatMarkdown({ content, className }: { content: string; className?: string }) {
  const { copied, copy } = useCopyButton();

  return (
    <div className={cn("text-[15px] leading-7 text-foreground", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="my-3 first:mt-0 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="my-4 text-[20px] font-semibold leading-7">{children}</h1>,
          h2: ({ children }) => <h2 className="my-4 text-[18px] font-semibold leading-7">{children}</h2>,
          h3: ({ children }) => <h3 className="my-3 text-[16px] font-semibold leading-6">{children}</h3>,
          ul: ({ children }) => <ul className="my-3 list-disc pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 list-decimal pl-6">{children}</ol>,
          li: ({ children }) => <li className="my-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-border pl-4 text-foreground/90">{children}</blockquote>
          ),
          a: ({ children, href }) => (
            <a className="underline underline-offset-4" href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className ?? "");
            const raw = String(children ?? "").replace(/\n$/, "");

            // inline
            if (!match) {
              return (
                <code
                  className="rounded bg-[hsl(var(--chat-code))] px-1.5 py-0.5 font-mono text-[13px] text-[hsl(var(--chat-code-foreground))]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-3 overflow-hidden rounded-lg border border-border bg-[hsl(var(--chat-code))]">
                <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
                  <div className="text-xs text-muted-foreground">{match[1].toUpperCase()}</div>
                  <Button
                    variant="chatGhost"
                    size="chatIcon"
                    onClick={() => copy(raw)}
                    aria-label={copied ? "Copiado" : "Copiar"}
                    title={copied ? "Copiado" : "Copiar"}
                  >
                    {copied ? <Check /> : <Copy />}
                  </Button>
                </div>
                <pre className="m-0 overflow-x-auto p-3 font-mono text-[13px] leading-5 text-[hsl(var(--chat-code-foreground))]">
                  <code className="bg-transparent" {...props}>
                    {raw}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
