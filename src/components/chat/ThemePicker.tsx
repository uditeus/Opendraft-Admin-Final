import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";
import { AppIcon } from "@/components/icons/AppIcon";

export function ThemePicker() {
    const { theme, setTheme } = useTheme();
    const { tt } = useI18n();

    return (
        <div className="grid grid-cols-3 gap-3 p-1">
            {/* Light Mode */}
            <div
                className={cn(
                    "group relative cursor-pointer",
                )}
                onClick={() => setTheme("light")}
                title={tt("Claro", "Light")}
            >
                <div
                    className={cn(
                        "relative aspect-[16/10] w-full overflow-hidden rounded-md border-2 transition-all",
                        theme === "light"
                            ? "border-foreground/10"
                            : "border-transparent hover:bg-muted/50"
                    )}
                >
                    <div className="absolute inset-0 bg-[#ffffff] p-2">
                        <div className="flex h-full flex-col gap-1.5">
                            <div className="h-1.5 w-1/3 rounded-[1px] bg-[#e5e7eb]" />
                            <div className="flex flex-1 gap-1.5">
                                <div className="w-1/4 rounded-[1px] bg-[#f3f4f6] h-full" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-full rounded-[1px] bg-[#f3f4f6]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dark Mode */}
            <div
                className={cn(
                    "group relative cursor-pointer",
                )}
                onClick={() => setTheme("dark")}
                title={tt("Escuro", "Dark")}
            >
                <div
                    className={cn(
                        "relative aspect-[16/10] w-full overflow-hidden rounded-md border-2 transition-all",
                        theme === "dark"
                            ? "border-foreground/10"
                            : "border-transparent hover:bg-muted/50"
                    )}
                >
                    <div className="absolute inset-0 bg-[#09090b] p-2">
                        <div className="flex h-full flex-col gap-1.5">
                            <div className="h-1.5 w-1/3 rounded-[1px] bg-[#27272a]" />
                            <div className="flex flex-1 gap-1.5">
                                <div className="w-1/4 rounded-[1px] bg-[#27272a] h-full" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-full rounded-[1px] bg-[#27272a]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Mode */}
            <div
                className={cn(
                    "group relative cursor-pointer",
                )}
                onClick={() => setTheme("system")}
                title={tt("Sistema", "System")}
            >
                <div
                    className={cn(
                        "relative aspect-[16/10] w-full overflow-hidden rounded-md border-2 transition-all",
                        theme === "system"
                            ? "border-foreground/10"
                            : "border-transparent hover:bg-muted/50"
                    )}
                >
                    <div className="absolute inset-0 flex">
                        {/* Left Half - Light */}
                        <div className="w-1/2 bg-[#ffffff] p-2">
                            <div className="flex h-full flex-col gap-1.5">
                                <div className="h-1.5 w-2/3 rounded-[1px] bg-[#e5e7eb]" />
                                <div className="flex flex-1 gap-1.5">
                                    <div className="w-full rounded-[1px] bg-[#f3f4f6] h-full" />
                                </div>
                            </div>
                        </div>
                        {/* Right Half - Dark */}
                        <div className="w-1/2 bg-[#09090b] p-2">
                            <div className="flex h-full flex-col gap-1.5 items-end">
                                <div className="h-1.5 w-2/3 rounded-[1px] bg-[#27272a]" />
                                <div className="flex flex-1 gap-1.5 w-full">
                                    <div className="w-full rounded-[1px] bg-[#27272a] h-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
