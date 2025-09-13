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

type Certificate = {
    id: number;
    name: string;
    issuer?: string;
    issue_date?: string;
    expires_at?: string;
    credential_id?: string;
    credential_url?: string;
    image_url?: string;
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

export default function AdminCertificates() {
    useRequireAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
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
    const [certificateToDelete, setCertificateToDelete] =
        useState<Certificate | null>(null);

    const fetchCertificates = useCallback(async () => {
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
                `/admin/certificates?${params}`
            );
            setCertificates(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    const handleDelete = async (certificate: Certificate) => {
        setCertificateToDelete(certificate);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!certificateToDelete) return;

        try {
            await apiClient.delete(
                `/admin/certificates?id=${certificateToDelete.id}`
            );
            await fetchCertificates();
            setDeleteModalOpen(false);
            setCertificateToDelete(null);
        } catch (error) {
            console.error("Error deleting certificate:", error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (published: boolean) => {
        return (
            <Badge variant={published ? "default" : "secondary"}>
                {published ? "Published" : "Draft"}
            </Badge>
        );
    };

    if (loading && certificates.length === 0) {
        return (
            <div className="space-y-6">
                <TitleSection
                    id="certificates-section"
                    title="Certificates"
                    description="Manage your certificates"
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
                id="certificates-section"
                title="Certificates"
                description="Manage your certificates"
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={() => fetchCertificates()}>Refresh</Button>
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
                {certificates.map((certificate) => (
                    <div
                        key={certificate.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                        {certificate.name}
                                    </h3>
                                    {getStatusBadge(certificate.published)}
                                </div>
                                {certificate.issuer && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Issuer: {certificate.issuer}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span>
                                        Issue Date:{" "}
                                        {formatDate(certificate.issue_date)}
                                    </span>
                                    <span>
                                        Expires:{" "}
                                        {formatDate(certificate.expires_at)}
                                    </span>
                                    <span>
                                        Sort Order: {certificate.sort_order}
                                    </span>
                                </div>
                                {certificate.credential_url && (
                                    <a
                                        href={certificate.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        View Credential
                                    </a>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(certificate)}
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
                    setCertificateToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Certificate"
                message={`Are you sure you want to delete "${certificateToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
