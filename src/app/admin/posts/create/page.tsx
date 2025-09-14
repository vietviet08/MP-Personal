"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight } from "lucide-react";
import PostForm from "@/components/Admin/PostForm";
import { apiClient } from "@/lib/api-client";

interface AIGeneratedContent {
    title: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
}

export default function CreatePostPage() {
    useRequireAuth();
    const router = useRouter();
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const postFormRef = useRef<{
        populateWithAI: (data: AIGeneratedContent) => void;
    }>(null);

    const [aiExcerpt, setAiExcerpt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAISection, setShowAISection] = useState(true);

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
        setShowAISection(true);
    };

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
                            một bài viết blog đầy đủ với tiêu đề, excerpt cải
                            thiện, nội dung chi tiết và ảnh bìa phù hợp.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Excerpt để sinh nội dung *
                                </label>
                                <Textarea
                                    value={aiExcerpt}
                                    onChange={(e) =>
                                        setAiExcerpt(e.target.value)
                                    }
                                    placeholder="Nhập đoạn mô tả ngắn về chủ đề bài viết... (VD: JavaScript là ngôn ngữ lập trình phổ biến nhất hiện nay)"
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
                                    Reset
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
                                        : "Sinh bài viết"}
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
                mode="create"
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
