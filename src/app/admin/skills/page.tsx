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
import { Skill, LegacyPaginationData } from "@/lib/supabase/types";
import Image from "next/image";

export default function AdminSkills() {
    useRequireAuth();
    const [skills, setSkills] = useState<Skill[]>([]);
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
    const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

    const fetchSkills = useCallback(async () => {
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

            const response = await apiClient.get(`/admin/skills?${params}`);
            setSkills(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleDelete = async (skill: Skill) => {
        setSkillToDelete(skill);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!skillToDelete) return;

        try {
            await apiClient.delete(`/admin/skills?id=${skillToDelete.id}`);
            await fetchSkills();
            setDeleteModalOpen(false);
            setSkillToDelete(null);
        } catch (error) {
            console.error("Error deleting skill:", error);
        }
    };

    const getLevelBadge = (level?: number) => {
        if (!level) return null;

        const getVariant = (level: number) => {
            if (level >= 8) return "default";
            if (level >= 6) return "secondary";
            return "outline";
        };

        return <Badge variant={getVariant(level)}>Level {level}/10</Badge>;
    };

    if (loading && skills.length === 0) {
        return (
            <div className="space-y-6">
                <TitleSection
                    id="skills-section"
                    title="Skills"
                    description="Manage your skills"
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
                id="skills-section"
                title="Skills"
                description="Manage your skills"
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={() => fetchSkills()}>Refresh</Button>
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
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {skill.name}
                                    </h3>
                                    {getLevelBadge(skill.level)}
                                </div>
                                {skill.category && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Category: {skill.category}
                                    </p>
                                )}
                                {skill.icon_url && (
                                    <div className="mt-2">
                                        <Image
                                            src={skill.icon_url}
                                            alt={skill.name}
                                            className="w-8 h-8 object-contain"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(skill)}
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
                    setSkillToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Skill"
                message={`Are you sure you want to delete "${skillToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
