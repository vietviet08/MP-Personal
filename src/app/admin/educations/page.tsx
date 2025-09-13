"use client";

import { useState, useEffect, useCallback } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { MessageFilters } from "@/components/ui/message-filters";
import { MessageSkeleton } from "@/components/ui/message-skeleton";
import { TitleSection } from "@/components/ui/title-section";

type Education = {
    id: number;
    school: string;
    degree?: string;
    field?: string;
    start_date?: string;
    end_date?: string;
    logo_url?: string;
    sort_order: number;
    created_at: string;
};

type PaginationData = {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
};

export default function AdminEducations() {
    useRequireAuth();
    const [educations, setEducations] = useState<Education[]>([]);
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
    const [educationToDelete, setEducationToDelete] =
        useState<Education | null>(null);

    const fetchEducations = useCallback(async () => {
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

            const response = await apiClient.get(`/admin/educations?${params}`);
            setEducations(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching educations:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm]);

    useEffect(() => {
        fetchEducations();
    }, [fetchEducations]);

    const handleDelete = async (education: Education) => {
        setEducationToDelete(education);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!educationToDelete) return;

        try {
            await apiClient.delete(
                `/admin/educations?id=${educationToDelete.id}`
            );
            await fetchEducations();
            setDeleteModalOpen(false);
            setEducationToDelete(null);
        } catch (error) {
            console.error("Error deleting education:", error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    if (loading && educations.length === 0) {
        return (
            <div className="space-y-6">
                <TitleSection
                    id="education-section"
                    title="Education"
                    description="Manage your education history"
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
                id="education-section"
                title="Education"
                description="Manage your education history"
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search education..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={() => fetchEducations()}>Refresh</Button>
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
                {educations.map((education) => (
                    <div
                        key={education.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {education.school}
                                    </h3>
                                </div>
                                {education.degree && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Degree: {education.degree}
                                    </p>
                                )}
                                {education.field && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Field: {education.field}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span>
                                        Start:{" "}
                                        {formatDate(education.start_date)}
                                    </span>
                                    <span>
                                        End: {formatDate(education.end_date)}
                                    </span>
                                    <span>
                                        Sort Order: {education.sort_order}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(education)}
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
                    setEducationToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Education"
                message={`Are you sure you want to delete "${educationToDelete?.school}"? This action cannot be undone.`}
            />
        </div>
    );
}
