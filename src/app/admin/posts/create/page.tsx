"use client";

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast, ToastContainer } from "@/components/ui/toast";
import PostForm from "@/components/Admin/PostForm";

export default function CreatePostPage() {
    useRequireAuth();
    const router = useRouter();
    const { toasts, removeToast } = useToast();

    const handleSuccess = () => {
        router.push("/admin/posts");
    };

    const handleCancel = () => {
        router.push("/admin/posts");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PostForm
                mode="create"
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
