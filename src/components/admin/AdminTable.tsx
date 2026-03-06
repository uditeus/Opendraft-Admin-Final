import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";

interface Column<T> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string;
    page?: number;
    pageSize?: number;
    total?: number;
    onPageChange?: (page: number) => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onRowClick?: (row: T) => void;
    exportable?: boolean;
    onExport?: () => void;
    emptyMessage?: string;
}

export function AdminTable<T extends Record<string, any>>({
    columns,
    data,
    keyExtractor,
    page,
    pageSize,
    total,
    onPageChange,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    onRowClick,
    exportable,
    onExport,
    emptyMessage = "Nenhum resultado encontrado",
}: AdminTableProps<T>) {
    const totalPages = total && pageSize ? Math.ceil(total / pageSize) : 1;

    return (
        <div className="flex flex-col gap-4">
            {/* Search + Export Row */}
            {(onSearchChange || exportable) && (
                <div className="flex items-center gap-3">
                    {onSearchChange && (
                        <div className="relative flex-1">
                            <AppIcon
                                name="Search"
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/40"
                            />
                            <input
                                type="text"
                                value={searchValue || ""}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={searchPlaceholder || "Buscar..."}
                                className={cn(
                                    "h-10 w-full rounded-full border border-border/50 bg-card pl-10 pr-4 shadow-sm",
                                    "text-[13px] text-foreground placeholder:text-muted-foreground/40",
                                    "outline-none focus:border-border transition-all",
                                )}
                            />
                        </div>
                    )}
                    {exportable && onExport && (
                        <button
                            onClick={onExport}
                            className={cn(
                                "chat-focus flex items-center gap-2 h-10 px-4 rounded-full text-[13px] font-medium transition-all shadow-sm",
                                "border border-border/50 bg-card",
                                "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                            )}
                        >
                            <AppIcon name="Download" className="h-[15px] w-[15px] opacity-60" />
                            Exportar
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/40 bg-muted/20">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-5 py-12 text-center text-[13px] text-muted-foreground italic">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((row) => (
                                    <tr
                                        key={keyExtractor(row)}
                                        className={cn(
                                            "transition-colors",
                                            onRowClick
                                                ? "cursor-pointer hover:bg-muted/20"
                                                : "",
                                        )}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((col) => (
                                            <td key={col.key} className="px-5 py-3.5 text-[13px] text-foreground/80">
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {page !== undefined && totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-tight">
                        Página {page} de {totalPages} · {total} resultados
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange?.(page - 1)}
                            className={cn(
                                "chat-focus h-8 w-8 grid place-items-center rounded-lg text-sm transition-all",
                                "border border-border/40 bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground",
                                "disabled:opacity-20 disabled:pointer-events-none shadow-sm",
                            )}
                        >
                            <AppIcon name="ChevronLeft" className="h-[14px] w-[14px]" />
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange?.(page + 1)}
                            className={cn(
                                "chat-focus h-8 w-8 grid place-items-center rounded-lg text-sm transition-all",
                                "border border-border/40 bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground",
                                "disabled:opacity-20 disabled:pointer-events-none shadow-sm",
                            )}
                        >
                            <AppIcon name="ChevronRight" className="h-[14px] w-[14px]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
