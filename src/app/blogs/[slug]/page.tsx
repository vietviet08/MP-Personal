"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/supabase/types";
import { CodeBlockProcessor } from "@/components/ui/syntax-highlighter";

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const slug = params.slug as string;

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/posts?slug=${encodeURIComponent(slug)}`
                );
                const data = await response.json();

                if (response.ok) {
                    setPost(data.data);
                } else {
                    setError(data.error || "Failed to load post");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: post?.title,
            text: post?.excerpt || post?.title,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback: copy URL to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link đã được sao chép!");
            } catch (error) {
                console.error("Error copying to clipboard:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-8"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="space-y-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Bài viết không tồn tại
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error ||
                            "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => router.back()} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                        <Button asChild>
                            <Link href="/blogs">Xem tất cả bài viết</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <article className="container mx-auto px-4 pt-24 pb-8">
                <div className="max-w-4xl mx-auto">
                    {/* Navigation */}
                    <nav className="flex items-center gap-4 mb-8">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Tất cả bài viết
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Trang chủ
                        </Link>
                    </nav>

                    {/* Cover Image */}
                    {post.cover_image_url && (
                        <div className="aspect-video mb-8 overflow-hidden rounded-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post.cover_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.parentElement!.style.display =
                                        "none";
                                }}
                            />
                        </div>
                    )}

                    {/* Header */}
                    <header className="mb-8">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Viet Quoc</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {formatDate(
                                        post.published_at || post.created_at
                                    )}
                                </span>
                            </div>

                            {post.reading_time_minutes && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {post.reading_time_minutes} phút đọc
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <Button
                                onClick={handleShare}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Chia sẻ
                            </Button>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div
                            className="text-gray-800 dark:text-gray-200 leading-relaxed"
                            style={{
                                lineHeight: "1.8",
                                fontSize: "1.125rem",
                            }}
                        >
                            <CodeBlockProcessor
                                htmlContent={post.content || ""}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p>
                                    Xuất bản:{" "}
                                    {formatDate(
                                        post.published_at || post.created_at
                                    )}
                                    {post.updated_at !== post.created_at && (
                                        <>
                                            {" "}
                                            • Cập nhật:{" "}
                                            {formatDate(post.updated_at)}
                                        </>
                                    )}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button asChild variant="outline">
                                    <Link href="/blogs">Xem thêm bài viết</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/#contact">
                                        Liên hệ với tôi
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </footer>
                </div>
            </article>
        </div>
    );
}
