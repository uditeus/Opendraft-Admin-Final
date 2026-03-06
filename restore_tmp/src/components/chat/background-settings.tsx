import * as React from "react";

export type HeroBackgroundMode = "solid";

export function BackgroundSettingsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useBackgroundSettings() {
  return { mode: "solid" as const, setMode: () => {} };
}
