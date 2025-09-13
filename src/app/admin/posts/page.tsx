"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MessagesSkeleton } from "@/components/ui/message-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { MessageFilters } from "@/components/ui/message-filters";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ToastContainer, useToast } from "@/components/ui/toast";
import {
    FileText,
    User,
    Calendar,
    Edit,
    Trash2,
    Plus,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/api-client";

type Post = {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    status: "draft" | "published" | "archived";
    author: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    tags: string[];
    view_count: number;
};

type PaginationData = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export default function AdminPosts() {
    const { loading: authLoading } = useAuthGuard();
    const { toasts, showSuccess, showError, removeToast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);

    // Use ref to store toast functions to avoid dependency issues
    const toastRef = useRef({ showError, showSuccess });
    toastRef.current = { showError, showSuccess };
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);

    const fetchPosts = useCallback(
        async (page = 1) => {
            if (authLoading) return;

            try {
                setIsLoading(true);
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: "10",
                    search,
                    sortBy,
                    sortOrder,
                });

                const response = await fetchWithAuth(
                    `/api/admin/posts?${params}`
                );
                if (response.ok) {
                    const result = await response.json();
                    setPosts(result.data || []);
                    if (result.pagination) {
                        setPagination(result.pagination);
                    }
                } else {
                    const errorData = await response.json();
                    toastRef.current.showError(
                        "Lỗi tải dữ liệu",
                        errorData.error || "Không thể tải bài viết"
                    );
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setTimeout(() => setIsLoading(false), 300);
            }
        },
        [authLoading, search, sortBy, sortOrder]
    );

    const handleDeletePost = async (postId: number) => {
        const post = posts.find((p) => p.id === postId);
        if (post) {
            setPostToDelete(post);
            setShowDeleteModal(true);
        }
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;

        try {
            setDeletingId(postToDelete.id);
            const response = await fetchWithAuth(
                `/api/admin/posts?id=${postToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                const newTotalItems = pagination.totalItems - 1;
                const newTotalPages = Math.ceil(
                    newTotalItems / pagination.itemsPerPage
                );
                const targetPage =
                    pagination.currentPage > newTotalPages
                        ? Math.max(1, newTotalPages)
                        : pagination.currentPage;

                await fetchPosts(targetPage);
                setShowDeleteModal(false);
                setPostToDelete(null);
                toastRef.current.showSuccess(
                    "Bài viết đã được xóa thành công."
                );
            } else {
                toastRef.current.showError(
                    "Không thể xóa bài viết",
                    "Vui lòng thử lại sau."
                );
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toastRef.current.showError(
                "Đã xảy ra lỗi",
                "Không thể xóa bài viết. Vui lòng thử lại sau."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPostToDelete(null);
    };

    const handlePageChange = (page: number) => {
        fetchPosts(page);
    };

    const handleSortChange = (
        newSortBy: string,
        newSortOrder: "asc" | "desc"
    ) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const handleClearFilters = () => {
        setSearch("");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            draft: {
                color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                label: "Bản nháp",
            },
            published: {
                color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                label: "Đã xuất bản",
            },
            archived: {
                color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                label: "Đã lưu trữ",
            },
        };

        const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.draft;

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
            >
                {config.label}
            </span>
        );
    };

    useEffect(() => {
        if (authLoading) return;

        const timer = setTimeout(() => {
            fetchPosts(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [authLoading, search, sortBy, sortOrder, fetchPosts]);

    if (authLoading) {
        return (
            <main>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-semibold">
                            Quản lý bài viết
                        </h1>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <MessageFilters
                        search={search}
                        onSearchChange={setSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                        totalItems={0}
                    />

                    <MessagesSkeleton />

                    <Pagination
                        currentPage={1}
                        totalPages={0}
                        onPageChange={() => {}}
                        hasNextPage={false}
                        hasPrevPage={false}
                        totalItems={0}
                        itemsPerPage={10}
                    />
                </div>

                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </main>
        );
    }

    return (
        <main>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Quản lý bài viết</h1>
                    {pagination.totalItems > 0 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                            {pagination.totalItems}
                        </span>
                    )}
                </div>
                <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Tạo bài viết mới</span>
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <MessageFilters
                    search={search}
                    onSearchChange={setSearch}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    onClearFilters={handleClearFilters}
                    totalItems={pagination.totalItems}
                />

                {isLoading ? (
                    <MessagesSkeleton />
                ) : (
                    <>
                        {posts.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {search
                                                ? "Không tìm thấy bài viết"
                                                : "Chưa có bài viết"}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {search
                                                ? `Không có bài viết nào khớp với "${search}"`
                                                : "Các bài viết sẽ hiển thị tại đây"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {posts.map((post, index) => (
                                    <div
                                        key={post.id}
                                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 animate-in fade-in-0 slide-in-from-bottom-2 group"
                                        style={{
                                            animationDelay: `${index * 0.05}s`,
                                        }}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                                {post.title}
                                                            </h3>
                                                            {getStatusBadge(
                                                                post.status
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2 ml-4">
                                                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Eye className="w-3 h-3" />
                                                            <span>
                                                                {
                                                                    post.view_count
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>
                                                                {new Date(
                                                                    post.created_at
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {post.author}
                                                        </span>
                                                        {post.tags.length >
                                                            0 && (
                                                            <>
                                                                <span className="text-gray-400">
                                                                    •
                                                                </span>
                                                                <div className="flex space-x-1">
                                                                    {post.tags
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .map(
                                                                            (
                                                                                tag,
                                                                                idx
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400"
                                                                                >
                                                                                    {
                                                                                        tag
                                                                                    }
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    {post.tags
                                                                        .length >
                                                                        3 && (
                                                                        <span className="text-xs text-gray-500">
                                                                            +
                                                                            {post
                                                                                .tags
                                                                                .length -
                                                                                3}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeletePost(
                                                                    post.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                post.id
                                                            }
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            {deletingId ===
                                                            post.id ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={pagination.hasNextPage}
                    hasPrevPage={pagination.hasPrevPage}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                />
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Xác nhận xóa bài viết"
                message={`Bạn có chắc chắn muốn xóa bài viết "${postToDelete?.title}" không?`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingId !== null}
            />

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </main>
    );
}
