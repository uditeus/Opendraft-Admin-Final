import * as React from "react";

export function useCopyState() {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copy = React.useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1200);
    } catch {
      // ignore
    }
  }, []);

  return { copiedId, copy };
}
