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
                <div className="flex items-center gap-3 w-full">
                    {onSearchChange && (
                        <div className="relative flex-1 max-w-sm">
                            <AppIcon
                                name="Search"
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            />
                            <input
                                type="text"
                                value={searchValue || ""}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={searchPlaceholder || "Buscar..."}
                                className={cn(
                                    "h-10 w-full rounded-2xl border border-border/50 bg-transparent pl-11 pr-4",
                                    "text-sm text-foreground placeholder:text-muted-foreground",
                                    "outline-none focus:border-[#0066fe] focus:ring-1 focus:ring-[#0066fe] transition-all",
                                )}
                            />
                        </div>
                    )}
                    {exportable && onExport && (
                        <button
                            onClick={onExport}
                            className={cn(
                                "flex items-center gap-2 h-10 px-5 rounded-2xl text-sm font-medium transition-colors",
                                "border border-border/50 bg-background text-foreground hover:bg-muted/20",
                            )}
                        >
                            <AppIcon name="Download" className="h-4 w-4 opacity-70" />
                            Exportar
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/30 bg-muted/5">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-muted-foreground italic">
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
                                            ? "cursor-pointer hover:bg-muted/10"
                                            : "hover:bg-muted/5",
                                    )}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm text-foreground">
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
                <div className="flex items-center justify-between px-2 pt-2 pb-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Página {page} de {totalPages} · {total} resultados
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange?.(page - 1)}
                            className={cn(
                                "h-8 w-8 grid place-items-center rounded-lg text-sm transition-all",
                                "border border-border/40 bg-transparent hover:bg-muted/20 text-muted-foreground hover:text-foreground",
                                "disabled:opacity-30 disabled:pointer-events-none",
                            )}
                        >
                            <AppIcon name="ChevronLeft" className="h-4 w-4" />
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange?.(page + 1)}
                            className={cn(
                                "h-8 w-8 grid place-items-center rounded-lg text-sm transition-all",
                                "border border-border/40 bg-transparent hover:bg-muted/20 text-muted-foreground hover:text-foreground",
                                "disabled:opacity-30 disabled:pointer-events-none",
                            )}
                        >
                            <AppIcon name="ChevronRight" className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}
