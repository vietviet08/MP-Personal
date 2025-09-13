"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MessagesSkeleton } from "@/components/ui/message-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { MessageFilters } from "@/components/ui/message-filters";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { Mail, User, Calendar, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/api-client";

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
};

type PaginationData = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export default function AdminMessages() {
    const { loading: authLoading } = useAuthGuard();
    const { toasts, showSuccess, showError, removeToast } = useToast();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
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
    const [messageToDelete, setMessageToDelete] =
        useState<ContactMessage | null>(null);

    // Use ref to store toast functions to avoid dependency issues
    const toastRef = useRef({ showError, showSuccess });
    toastRef.current = { showError, showSuccess };

    const fetchMessages = useCallback(
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
                    `/api/admin/messages?${params}`
                );
                if (response.ok) {
                    const result = await response.json();
                    setMessages(result.data || []);
                    if (result.pagination) {
                        setPagination(result.pagination);
                    }
                } else {
                    const errorData = await response.json();
                    toastRef.current.showError(
                        "Lỗi tải dữ liệu",
                        errorData.error || "Không thể tải tin nhắn"
                    );
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setTimeout(() => setIsLoading(false), 300);
            }
        },
        [authLoading, search, sortBy, sortOrder]
    );

    const handleDeleteMessage = async (messageId: number) => {
        const message = messages.find((m) => m.id === messageId);
        if (message) {
            setMessageToDelete(message);
            setShowDeleteModal(true);
        }
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;

        try {
            setDeletingId(messageToDelete.id);
            const response = await fetchWithAuth(
                `/api/admin/messages?id=${messageToDelete.id}`,
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

                await fetchMessages(targetPage);
                setShowDeleteModal(false);
                setMessageToDelete(null);
                toastRef.current.showSuccess(
                    "Tin nhắn đã được xóa thành công."
                );
            } else {
                toastRef.current.showError(
                    "Không thể xóa tin nhắn",
                    "Vui lòng thử lại sau."
                );
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            toastRef.current.showError(
                "Đã xảy ra lỗi",
                "Không thể xóa tin nhắn. Vui lòng thử lại sau."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setMessageToDelete(null);
    };

    const handlePageChange = (page: number) => {
        fetchMessages(page);
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

    useEffect(() => {
        if (authLoading) return;

        const timer = setTimeout(() => {
            fetchMessages(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [authLoading, search, sortBy, sortOrder, fetchMessages]);

    if (authLoading) {
        return (
            <main className="h-screen flex flex-col overflow-hidden">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Contact Messages</h1>
                </div>

                {/* Content Container - Flex grow */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    {/* Filters - Fixed */}
                    <div className="flex-shrink-0">
                        <MessageFilters
                            search={search}
                            onSearchChange={setSearch}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSortChange={handleSortChange}
                            onClearFilters={handleClearFilters}
                            totalItems={0}
                        />
                    </div>

                    {/* Loading State */}
                    <div className="flex-1 min-h-0 overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-600">
                        <MessagesSkeleton />
                    </div>

                    {/* Pagination - Fixed */}
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
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
                </div>

                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </main>
        );
    }

    return (
        <main className="h-screen flex flex-col overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-semibold">Contact Messages</h1>
                {pagination.totalItems > 0 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                        {pagination.totalItems}
                    </span>
                )}
            </div>

            {/* Content Container - Flex grow */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Filters - Fixed */}
                <div className="flex-shrink-0">
                    <MessageFilters
                        search={search}
                        onSearchChange={setSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                        totalItems={pagination.totalItems}
                    />
                </div>

                {/* Messages List - Scrollable */}
                <div className="flex-1 min-h-0 overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
                    {isLoading ? (
                        <MessagesSkeleton />
                    ) : (
                        <>
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                            <Mail className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {search
                                                    ? "Không tìm thấy tin nhắn"
                                                    : "Chưa có tin nhắn"}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {search
                                                    ? `Không có tin nhắn nào khớp với "${search}"`
                                                    : "Các tin nhắn liên hệ sẽ hiển thị tại đây"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {messages.map((m, index) => (
                                        <div
                                            key={m.id}
                                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500"
                                            style={{
                                                animationDelay: `${index * 0.02}s`,
                                            }}
                                        >
                                            <div className="flex items-start space-x-3">
                                                {/* Avatar */}
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                                    {m.name}
                                                                </h4>
                                                                {m.subject && (
                                                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                                                                        {
                                                                            m.subject
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                                <a
                                                                    href={`mailto:${m.email}`}
                                                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                                                                >
                                                                    <Mail className="w-3 h-3" />
                                                                    <span>
                                                                        {
                                                                            m.email
                                                                        }
                                                                    </span>
                                                                </a>
                                                                <div className="flex items-center space-x-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>
                                                                        {new Date(
                                                                            m.created_at
                                                                        ).toLocaleDateString(
                                                                            "vi-VN",
                                                                            {
                                                                                day: "2-digit",
                                                                                month: "2-digit",
                                                                                year: "numeric",
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2 ml-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDeleteMessage(
                                                                        m.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    m.id
                                                                }
                                                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                                                            >
                                                                {deletingId ===
                                                                m.id ? (
                                                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Message Content */}
                                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-2">
                                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                            {m.message.length >
                                                            200
                                                                ? `${m.message.substring(0, 200)}...`
                                                                : m.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination - Fixed */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
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
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Xác nhận xóa tin nhắn"
                message={`Bạn có chắc chắn muốn xóa tin nhắn từ ${messageToDelete?.name} (${messageToDelete?.email}) không?`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingId !== null}
            />

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </main>
    );
}
