"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import PostForm from "@/components/Admin/PostForm";
import { Post } from "@/lib/supabase/types";
import { apiClient } from "@/lib/api-client";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { ArrowLeft, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AIGeneratedContent {
    title: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
}

export default function EditPostPage() {
    useRequireAuth();
    const router = useRouter();
    const params = useParams();
    const { showError, showSuccess, toasts, removeToast } = useToast();
    const postFormRef = useRef<{
        populateWithAI: (data: AIGeneratedContent) => void;
    }>(null);

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [aiExcerpt, setAiExcerpt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAISection, setShowAISection] = useState(false);

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

    const handleAIGenerate = async () => {
        if (!aiExcerpt.trim()) {
            showError("Vui lòng nhập excerpt để sinh nội dung");
            return;
        }

        setIsGenerating(true);
        try {
            const generatedContent: AIGeneratedContent = await apiClient.post(
                "/api/admin/posts/ai-generate",
                {
                    excerpt: aiExcerpt.trim(),
                }
            );

            // Validate generated content
            if (
                !generatedContent ||
                !generatedContent.title ||
                !generatedContent.content
            ) {
                console.error("Invalid generated content:", generatedContent);
                throw new Error("Generated content is incomplete");
            }

            // Populate PostForm với data được sinh ra
            if (postFormRef.current && postFormRef.current.populateWithAI) {
                postFormRef.current.populateWithAI(generatedContent);
                showSuccess("Đã sinh nội dung blog thành công!");
                setShowAISection(false); // Ẩn AI section sau khi generate
            } else {
                throw new Error("PostForm reference not available");
            }
        } catch (error) {
            console.error("Error generating content:", error);
            if (error instanceof Error) {
                showError(`Không thể sinh nội dung blog: ${error.message}`);
            } else {
                showError("Không thể sinh nội dung blog. Vui lòng thử lại.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const resetAISection = () => {
        setAiExcerpt("");
        setShowAISection(false);
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
            {showAISection && (
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                AI Blog Generator
                            </h2>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Nhập một đoạn mô tả ngắn và AI sẽ tự động sinh ra
                            nội dung mới để thay thế hoặc bổ sung cho bài viết
                            hiện tại.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Excerpt để sinh nội dung mới *
                                </label>
                                <Textarea
                                    value={aiExcerpt}
                                    onChange={(e) =>
                                        setAiExcerpt(e.target.value)
                                    }
                                    placeholder="Nhập đoạn mô tả ngắn về nội dung mới muốn sinh... (VD: Cách tối ưu hóa performance trong React)"
                                    rows={4}
                                    maxLength={500}
                                    className="resize-none"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {aiExcerpt.length}/500 ký tự
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetAISection}
                                    disabled={isGenerating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleAIGenerate}
                                    disabled={isGenerating || !aiExcerpt.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isGenerating ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    ) : (
                                        <Sparkles className="w-4 h-4 mr-2" />
                                    )}
                                    {isGenerating
                                        ? "Đang sinh nội dung..."
                                        : "Sinh nội dung mới"}
                                    {!isGenerating && (
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!showAISection && (
                <div className="max-w-4xl mx-auto p-6 pb-0">
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAISection(true)}
                            className="mb-6"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Sinh nội dung mới với AI
                        </Button>
                    </div>
                </div>
            )}

            <PostForm
                ref={postFormRef}
                post={post}
                mode="edit"
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
