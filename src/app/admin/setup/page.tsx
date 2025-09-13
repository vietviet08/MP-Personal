"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ToastContainer, useToast } from "@/components/ui/toast";
import {
    Database,
    CheckCircle,
    XCircle,
    AlertCircle,
    Copy,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/api-client";

type TableStatus = {
    table: string;
    status: "exists" | "not_exists" | "error";
    message?: string;
    error?: string;
    sql?: string;
};

export default function AdminSetup() {
    const { loading: authLoading } = useAuthGuard();
    const { toasts, showSuccess, showError, removeToast } = useToast();
    const [isChecking, setIsChecking] = useState(false);
    const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
    const [copiedSql, setCopiedSql] = useState<string | null>(null);

    const checkDatabase = async () => {
        try {
            setIsChecking(true);
            const response = await fetchWithAuth("/api/setup", {
                method: "POST",
            });

            if (response.ok) {
                const result = await response.json();
                setTableStatuses(result.results);
                showSuccess("Kiểm tra database hoàn tất");
            } else {
                const errorData = await response.json();
                showError("Lỗi kiểm tra database", errorData.error);
            }
        } catch (error) {
            console.error("Error checking database:", error);
            showError("Đã xảy ra lỗi", "Không thể kiểm tra database");
        } finally {
            setIsChecking(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedSql(text);
            showSuccess("Đã copy SQL vào clipboard");
            setTimeout(() => setCopiedSql(null), 2000);
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            showError("Không thể copy", "Vui lòng copy thủ công");
        }
    };

    const downloadSQL = () => {
        const allSQL = tableStatuses
            .filter((t) => t.sql)
            .map((t) => `-- ${t.table}\n${t.sql}`)
            .join("\n\n");

        const blob = new Blob([allSQL], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "database_setup.sql";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccess("Đã tải file SQL");
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "exists":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "not_exists":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case "error":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "exists":
                return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
            case "not_exists":
                return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
            case "error":
                return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
            default:
                return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
        }
    };

    if (authLoading) {
        return (
            <main>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Database Setup</h1>
                </div>
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Database Setup</h1>
                </div>
                <div className="flex space-x-2">
                    {tableStatuses.length > 0 && (
                        <Button
                            onClick={downloadSQL}
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Tải SQL</span>
                        </Button>
                    )}
                    <Button
                        onClick={checkDatabase}
                        disabled={isChecking}
                        className="flex items-center space-x-2"
                    >
                        <Database className="w-4 h-4" />
                        <span>
                            {isChecking
                                ? "Đang kiểm tra..."
                                : "Kiểm tra Database"}
                        </span>
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Hướng dẫn Setup Database
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p>1. Truy cập Supabase Dashboard → SQL Editor</p>
                        <p>2. Chạy các câu lệnh SQL được tạo bên dưới</p>
                        <p>3. Nhấn &quot;Kiểm tra Database&quot; để xác nhận</p>
                    </div>
                </div>

                {tableStatuses.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white">
                            Trạng thái các bảng:
                        </h3>
                        {tableStatuses.map((table, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon(table.status)}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {table.table}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}
                                        >
                                            {table.status === "exists"
                                                ? "Đã tồn tại"
                                                : table.status === "not_exists"
                                                  ? "Chưa tồn tại"
                                                  : "Lỗi"}
                                        </span>
                                    </div>
                                    {table.sql && (
                                        <Button
                                            onClick={() =>
                                                copyToClipboard(table.sql!)
                                            }
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center space-x-1"
                                        >
                                            <Copy className="w-4 h-4" />
                                            <span>
                                                {copiedSql === table.sql
                                                    ? "Đã copy"
                                                    : "Copy SQL"}
                                            </span>
                                        </Button>
                                    )}
                                </div>

                                {table.message && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {table.message}
                                    </p>
                                )}

                                {table.error && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                                        Lỗi: {table.error}
                                    </p>
                                )}

                                {table.sql && (
                                    <div className="mt-3">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SQL để tạo bảng:
                                        </h4>
                                        <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                                            <code>{table.sql}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {tableStatuses.length === 0 && (
                    <div className="text-center py-8">
                        <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Nhấn &quot;Kiểm tra Database&quot; để bắt đầu
                        </p>
                    </div>
                )}
            </div>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </main>
    );
}
