import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "danger",
    isLoading = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return {
                    icon: <Trash2 className="w-6 h-6 text-red-600" />,
                    confirmButton:
                        "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                    iconBg: "bg-red-100 dark:bg-red-900/30",
                };
            case "warning":
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
                    confirmButton:
                        "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
                    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
                };
            default:
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
                    confirmButton:
                        "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
                    iconBg: "bg-blue-100 dark:bg-blue-900/30",
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                            {styles.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    </div>

                    {/* Message */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="min-w-[80px]"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`text-white ${styles.confirmButton} min-w-[80px]`}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                confirmText
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
