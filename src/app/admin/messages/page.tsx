"use client";

import {useEffect, useState, useCallback} from "react";
import {useAuthGuard} from "@/hooks/useAuthGuard";
import {MessagesSkeleton} from "@/components/ui/message-skeleton";
import {Pagination} from "@/components/ui/pagination";
import {MessageFilters} from "@/components/ui/message-filters";
import {ConfirmationModal} from "@/components/ui/confirmation-modal";
import {ToastContainer, useToast} from "@/components/ui/toast";
import {Mail, User, Calendar, MessageSquare, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";

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
    const {loading: authLoading} = useAuthGuard();
    const {toasts, showSuccess, showError, removeToast} = useToast();
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

                const response = await fetch(`/api/admin/messages?${params}`);
                if (response.ok) {
                    const result = await response.json();
                    setMessages(result.data || []);
                    if (result.pagination) {
                        setPagination(result.pagination);
                    }
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
            const response = await fetch(
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
                showSuccess("Tin nhắn đã được xóa thành công.");
            } else {
                showError("Không thể xóa tin nhắn", "Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            showError(
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
        const timer = setTimeout(() => {
            fetchMessages(1)
        }, 300);

        return () => clearTimeout(timer);
    }, [search, sortBy, sortOrder, fetchMessages]);

    useEffect(() => {
        if (!authLoading) {
            fetchMessages(1);
        }
    }, [authLoading, fetchMessages]);

    if (authLoading) {
        return (
            <main >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                    </div>
                    <h1 className="text-2xl font-semibold">Contact Messages</h1>
                </div>

                <div
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <MessageFilters
                        search={search}
                        onSearchChange={setSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                        totalItems={0}
                    />

                    <MessagesSkeleton/>

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

                <ToastContainer toasts={toasts} onRemove={removeToast}/>
            </main>
        );
    }

    return (
        <main >
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                </div>
                <h1 className="text-2xl font-semibold">Contact Messages</h1>
                {pagination.totalItems > 0 && (
                    <span
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                        {pagination.totalItems}
                    </span>
                )}
            </div>

            <div
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
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
                    <MessagesSkeleton/>
                ) : (
                    <>
                        {messages.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                        <Mail className="w-8 h-8 text-gray-400"/>
                                    </div>
                                    <div>
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
                                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 animate-in fade-in-0 slide-in-from-bottom-2 group"
                                        style={{
                                            animationDelay: `${index * 0.05}s`,
                                        }}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {m.name}
                                                        </span>
                                                        <span className="text-gray-400">
                                                            •
                                                        </span>
                                                        <a
                                                            href={`mailto:${m.email}`}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                                        >
                                                            {m.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Calendar className="w-3 h-3"/>
                                                            <span>
                                                                {new Date(
                                                                    m.created_at
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>

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
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            {deletingId ===
                                                            m.id ? (
                                                                <div
                                                                    className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"/>
                                                            ) : (
                                                                <Trash2 className="w-4 h-4"/>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {m.subject && (
                                                    <div
                                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md inline-block">
                                                        <span
                                                            className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {m.subject}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                        {m.message}
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
                title="Xác nhận xóa tin nhắn"
                message={`Bạn có chắc chắn muốn xóa tin nhắn từ ${messageToDelete?.name} (${messageToDelete?.email}) không?`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingId !== null}
            />

            <ToastContainer toasts={toasts} onRemove={removeToast}/>
        </main>
    );
}
