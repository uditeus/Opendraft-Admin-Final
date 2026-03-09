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
        <div className="flex flex-col gap-8">
            {/* Search + Export Row */}
            {(onSearchChange || exportable) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full mb-4">
                    {onSearchChange && (
                        <div className="relative w-full sm:max-w-md">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40">
                                <AppIcon name="Search" className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                            <input
                                type="text"
                                value={searchValue || ""}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={searchPlaceholder || "Search..."}
                                className={cn(
                                    "h-11 w-full rounded-2xl border border-border/10 bg-muted/5 pl-11 pr-4",
                                    "text-[15px] text-foreground placeholder:text-muted-foreground/30",
                                    "outline-none focus:border-border/20 transition-all duration-300 shadow-sm",
                                )}
                            />
                        </div>
                    )}
                    {exportable && onExport && (
                        <button
                            onClick={onExport}
                            className={cn(
                                "flex items-center gap-2.5 h-11 px-6 rounded-2xl text-[13px] font-medium transition-all shrink-0",
                                "border border-border/10 bg-muted/5 text-foreground hover:bg-muted/10",
                            )}
                        >
                            <AppIcon name="Download" className="h-[18px] w-[18px] opacity-60" />
                            Exportar
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto -mx-1">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="border-b border-border/5">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/30 first:pl-2"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/5">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-32 text-center text-base text-muted-foreground italic font-serif opacity-30">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={keyExtractor(row)}
                                    className={cn(
                                        "transition-all group",
                                        onRowClick
                                            ? "cursor-pointer hover:bg-muted/10"
                                            : "hover:bg-muted/5",
                                    )}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-6 text-[14.5px] text-foreground font-normal first:pl-2 last:pr-2">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {page !== undefined && totalPages > 1 && (
                <div className="flex items-center justify-between py-10 border-t border-border/5 mt-4">
                    <span className="text-[12px] font-medium text-muted-foreground/40 tabular-nums">
                        Página {page} de {totalPages} <span className="mx-2 opacity-50">/</span> {total} entradas
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange?.(page - 1)}
                            className={cn(
                                "h-10 w-10 flex items-center justify-center rounded-xl transition-all border border-border/10 shadow-sm",
                                "text-muted-foreground hover:bg-muted/10 hover:text-foreground",
                                "disabled:opacity-5 disabled:pointer-events-none",
                            )}
                        >
                            <AppIcon name="ChevronLeft" className="h-4.5 w-4.5" />
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange?.(page + 1)}
                            className={cn(
                                "h-10 w-10 flex items-center justify-center rounded-xl transition-all border border-border/10 shadow-sm",
                                "text-muted-foreground hover:bg-muted/10 hover:text-foreground",
                                "disabled:opacity-5 disabled:pointer-events-none",
                            )}
                        >
                            <AppIcon name="ChevronRight" className="h-4.5 w-4.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
