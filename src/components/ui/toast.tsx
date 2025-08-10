import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show toast with animation
        const showTimer = setTimeout(() => setIsVisible(true), 100);

        // Auto hide toast
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300); // Wait for fade out animation
        }, toast.duration || 5000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [toast.id, toast.duration, onRemove]);

    const getToastStyles = () => {
        switch (toast.type) {
            case "success":
                return {
                    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                    bg: "bg-green-50 dark:bg-green-900/20",
                    border: "border-green-200 dark:border-green-800",
                    iconBg: "bg-green-100 dark:bg-green-900/30",
                };
            case "error":
                return {
                    icon: <XCircle className="w-5 h-5 text-red-600" />,
                    bg: "bg-red-50 dark:bg-red-900/20",
                    border: "border-red-200 dark:border-red-800",
                    iconBg: "bg-red-100 dark:bg-red-900/30",
                };
            case "warning":
                return {
                    icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
                    bg: "bg-yellow-50 dark:bg-yellow-900/20",
                    border: "border-yellow-200 dark:border-yellow-800",
                    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
                };
            default:
                return {
                    icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                    border: "border-blue-200 dark:border-blue-800",
                    iconBg: "bg-blue-100 dark:bg-blue-900/30",
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={cn(
                "flex items-start space-x-3 p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out",
                styles.bg,
                styles.border,
                isVisible
                    ? "translate-x-0 opacity-100 scale-100"
                    : "translate-x-full opacity-0 scale-95"
            )}
        >
            <div className={`p-1.5 rounded-md ${styles.iconBg}`}>
                {styles.icon}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {toast.title}
                </h4>
                {toast.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {toast.message}
                    </p>
                )}
            </div>

            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onRemove(toast.id), 300);
                }}
                className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

// Toast hook for easy usage
export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const showSuccess = (title: string, message?: string) => {
        addToast({ type: "success", title, message });
    };

    const showError = (title: string, message?: string) => {
        addToast({ type: "error", title, message });
    };

    const showWarning = (title: string, message?: string) => {
        addToast({ type: "warning", title, message });
    };

    const showInfo = (title: string, message?: string) => {
        addToast({ type: "info", title, message });
    };

    return {
        toasts,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
    };
}
