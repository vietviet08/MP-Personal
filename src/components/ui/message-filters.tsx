import { Search, Filter, SortAsc, SortDesc, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageFiltersProps {
    search: string;
    onSearchChange: (search: string) => void;
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    onClearFilters: () => void;
    totalItems: number;
}

export function MessageFilters({
    search,
    onSearchChange,
    sortBy,
    sortOrder,
    onSortChange,
    onClearFilters,
    totalItems,
}: MessageFiltersProps) {
    const sortOptions = [
        { value: "created_at", label: "Ngày tạo" },
        { value: "name", label: "Tên" },
        { value: "email", label: "Email" },
        { value: "subject", label: "Tiêu đề" },
    ];

    const currentSortLabel =
        sortOptions.find((opt) => opt.value === sortBy)?.label || "Ngày tạo";
    const hasActiveFilters =
        search.length > 0 || sortBy !== "created_at" || sortOrder !== "desc";

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-1 items-center space-x-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm theo tên, email, tiêu đề hoặc nội dung..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {search && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSearchChange("")}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Sort */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2"
                            >
                                <Filter className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {currentSortLabel}
                                </span>
                                {sortOrder === "asc" ? (
                                    <SortAsc className="w-4 h-4" />
                                ) : (
                                    <SortDesc className="w-4 h-4" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {sortOptions.map((option) => (
                                <div key={option.value}>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            onSortChange(option.value, "desc")
                                        }
                                        className="flex items-center justify-between"
                                    >
                                        <span>{option.label}</span>
                                        {sortBy === option.value &&
                                            sortOrder === "desc" && (
                                                <SortDesc className="w-4 h-4" />
                                            )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            onSortChange(option.value, "asc")
                                        }
                                        className="flex items-center justify-between"
                                    >
                                        <span>{option.label} (A-Z)</span>
                                        {sortBy === option.value &&
                                            sortOrder === "asc" && (
                                                <SortAsc className="w-4 h-4" />
                                            )}
                                    </DropdownMenuItem>
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Results count */}
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {totalItems} kết quả
                    </span>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="text-sm"
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
