"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import PostForm from "@/components/Admin/PostForm";
import { Post } from "@/lib/supabase/types";
import { apiClient } from "@/lib/api-client";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditPostPage() {
    useRequireAuth();
    const router = useRouter();
    const params = useParams();
    const { showError, toasts, removeToast } = useToast();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const postId = params.id as string;

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;

            try {
                setLoading(true);
                setError(null);

                const response = await apiClient.get(
                    `/api/admin/posts/${postId}`
                );
                setPost(response.data);
            } catch {
                setError("Failed to load post");
                showError("Error", "Failed to load post details");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, showError]);

    const handleSuccess = () => {
        router.push("/admin/posts");
    };

    const handleCancel = () => {
        router.push("/admin/posts");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading post...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Post Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || "The post you're looking for doesn't exist."}
                    </p>
                    <Button onClick={() => router.push("/admin/posts")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Posts
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PostForm
                post={post}
                mode="edit"
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
