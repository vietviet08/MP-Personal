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

type Experience = {
    id: number;
    company: string;
    role: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description?: string;
    highlights?: unknown;
    logo_url?: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
};

type PaginationData = {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
};

export default function AdminExperiences() {
    useRequireAuth();
    const [experiences, setExperiences] = useState<Experience[]>([]);
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
    const [experienceToDelete, setExperienceToDelete] =
        useState<Experience | null>(null);

    const fetchExperiences = useCallback(async () => {
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
                `/admin/experiences?${params}`
            );
            setExperiences(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching experiences:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm]);

    useEffect(() => {
        fetchExperiences();
    }, [fetchExperiences]);

    const handleDelete = async (experience: Experience) => {
        setExperienceToDelete(experience);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!experienceToDelete) return;

        try {
            await apiClient.delete(
                `/admin/experiences?id=${experienceToDelete.id}`
            );
            await fetchExperiences();
            setDeleteModalOpen(false);
            setExperienceToDelete(null);
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const getCurrentBadge = (current: boolean) => {
        return (
            <Badge variant={current ? "default" : "secondary"}>
                {current ? "Current" : "Past"}
            </Badge>
        );
    };

    if (loading && experiences.length === 0) {
        return (
            <div className="space-y-6">
                <TitleSection
                    id="experience-section"
                    title="Experience"
                    description="Manage your work experience"
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
                id="experience-section"
                title="Experience"
                description="Manage your work experience"
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={() => fetchExperiences()}>Refresh</Button>
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
                {experiences.map((experience) => (
                    <div
                        key={experience.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {experience.role}
                                    </h3>
                                    {getCurrentBadge(experience.current)}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {experience.company}
                                </p>
                                {experience.location && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Location: {experience.location}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span>
                                        Start:{" "}
                                        {formatDate(experience.start_date)}
                                    </span>
                                    <span>
                                        End: {formatDate(experience.end_date)}
                                    </span>
                                    <span>
                                        Sort Order: {experience.sort_order}
                                    </span>
                                </div>
                                {experience.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        {experience.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(experience)}
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
                    setExperienceToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Experience"
                message={`Are you sure you want to delete "${experienceToDelete?.role}" at "${experienceToDelete?.company}"? This action cannot be undone.`}
            />
        </div>
    );
}
