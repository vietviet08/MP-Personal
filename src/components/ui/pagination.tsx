import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalItems: number;
    itemsPerPage: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPrevPage,
    totalItems,
    itemsPerPage,
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + maxPagesToShow - 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>
                    {totalItems === 0
                        ? "Không có kết quả nào"
                        : `Hiển thị ${startItem} - ${endItem} của ${totalItems} kết quả`}
                </span>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={!hasPrevPage}
                        className="hidden sm:flex"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPrevPage}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Trước</span>
                    </Button>

                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page) => (
                            <Button
                                key={page}
                                variant={
                                    page === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="min-w-[2.5rem]"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                    >
                        <span className="hidden sm:inline mr-1">Sau</span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={!hasNextPage}
                        className="hidden sm:flex"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
