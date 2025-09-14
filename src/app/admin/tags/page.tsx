"use client";

import { useState, useEffect, useCallback } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { MessageFilters } from "@/components/ui/message-filters";
import { MessageSkeleton } from "@/components/ui/message-skeleton";
import { TitleSection } from "@/components/ui/title-section";
import { Tag, LegacyPaginationData } from "@/lib/supabase/types";

export default function AdminTags() {
    useRequireAuth();
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<LegacyPaginationData>({
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

    const fetchTags = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                sort_by: sortBy,
                sort_order: sortOrder,
            });

            if (searchTerm) {
                params.append("search", searchTerm);
            }

            const response = await apiClient.get(`/admin/tags?${params}`);
            setTags(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm]);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const handleDelete = async (tag: Tag) => {
        setTagToDelete(tag);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!tagToDelete) return;

        try {
            await apiClient.delete(`/admin/tags?id=${tagToDelete.id}`);
            await fetchTags();
            setDeleteModalOpen(false);
            setTagToDelete(null);
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    if (loading && tags.length === 0) {
        return (
            <div className="space-y-6">
                <TitleSection
                    id="tags-section"
                    title="Tags"
                    description="Manage your tags"
                />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <MessageSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <TitleSection
                id="tags-section"
                title="Tags"
                description="Manage your tags"
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={() => fetchTags()}>Refresh</Button>
            </div>

            <MessageFilters
                search={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(newSortBy, newSortOrder) => {
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                }}
                onClearFilters={() => {
                    setSearchTerm("");
                    setSortBy("name");
                    setSortOrder("asc");
                }}
                totalItems={pagination.total}
            />

            <div className="space-y-4">
                {tags.map((tag) => (
                    <div
                        key={tag.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {tag.name}
                                    </h3>
                                    <Badge variant="outline">{tag.slug}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Created:{" "}
                                    {new Date(
                                        tag.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(tag)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pagination.total_pages > 1 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.total_pages}
                    onPageChange={(page) =>
                        setPagination((prev) => ({ ...prev, page }))
                    }
                    hasNextPage={pagination.page < pagination.total_pages}
                    hasPrevPage={pagination.page > 1}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                />
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setTagToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Tag"
                message={`Are you sure you want to delete "${tagToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
