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

type Testimonial = {
    id: number;
    author_name: string;
    author_role?: string;
    company?: string;
    avatar_url?: string;
    content: string;
    published: boolean;
    sort_order: number;
    created_at: string;
};

type PaginationData = {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
};

export default function AdminTestimonials() {
    useRequireAuth();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 0,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("sort_order");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] =
        useState<Testimonial | null>(null);

    const fetchTestimonials = useCallback(async () => {
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

            const response = await apiClient.get(
                `/admin/testimonials?${params}`
            );
            setTestimonials(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const handleDelete = async (testimonial: Testimonial) => {
        setTestimonialToDelete(testimonial);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!testimonialToDelete) return;

        try {
            await apiClient.delete(
                `/admin/testimonials?id=${testimonialToDelete.id}`
            );
            await fetchTestimonials();
            setDeleteModalOpen(false);
            setTestimonialToDelete(null);
        } catch (error) {
            console.error("Error deleting testimonial:", error);
        }
    };

    const getStatusBadge = (published: boolean) => {
        return (
            <Badge variant={published ? "default" : "secondary"}>
                {published ? "Published" : "Draft"}
            </Badge>
        );
    };

    if (loading && testimonials.length === 0) {
        return (
            <div className="space-y-6">
                <TitleSection
                    id="testimonials-section"
                    title="Testimonials"
                    description="Manage your testimonials"
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
                id="testimonials-section"
                title="Testimonials"
                description="Manage your testimonials"
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={() => fetchTestimonials()}>Refresh</Button>
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
                    setSortBy("sort_order");
                    setSortOrder("asc");
                }}
                totalItems={pagination.total}
            />

            <div className="space-y-4">
                {testimonials.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {testimonial.author_name}
                                    </h3>
                                    {getStatusBadge(testimonial.published)}
                                </div>
                                {testimonial.author_role && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Role: {testimonial.author_role}
                                    </p>
                                )}
                                {testimonial.company && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Company: {testimonial.company}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {testimonial.content}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span>
                                        Sort Order: {testimonial.sort_order}
                                    </span>
                                    <span>
                                        Created:{" "}
                                        {new Date(
                                            testimonial.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(testimonial)}
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
                    setTestimonialToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Testimonial"
                message={`Are you sure you want to delete the testimonial from "${testimonialToDelete?.author_name}"? This action cannot be undone.`}
            />
        </div>
    );
}
