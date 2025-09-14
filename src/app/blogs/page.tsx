"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { Search, Calendar, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Post, PaginationData } from "@/lib/supabase/types";

function PostsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 6,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const fetchPosts = useCallback(async (page = 1, searchQuery = "") => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "6",
                ...(searchQuery && { search: searchQuery }),
            });

            const response = await fetch(`/api/posts?${params}`);
            const data = await response.json();

            if (response.ok) {
                setPosts(data.data || []);
                setPagination(data.pagination || {});
            } else {
                console.error("Error fetching posts:", data.error);
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const currentPage = parseInt(searchParams.get("page") || "1");
        const currentSearch = searchParams.get("search") || "";
        setSearch(currentSearch);
        fetchPosts(currentPage, currentSearch);
    }, [searchParams, fetchPosts]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (search.trim()) {
            params.set("search", search.trim());
        } else {
            params.delete("search");
        }
        params.set("page", "1");
        router.push(`/blogs?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/blogs?${params.toString()}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getExcerpt = (post: Post) => {
        if (post.excerpt) return post.excerpt;

        // If no excerpt, create one from content
        const plainText = post.content?.replace(/<[^>]*>/g, "") || "";
        return plainText.length > 150
            ? plainText.substring(0, 150) + "..."
            : plainText;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6"
                                >
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay về trang chủ
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Blog & Bài viết
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Chia sẻ kiến thức, kinh nghiệm và những suy nghĩ về công
                        nghệ, lập trình và cuộc sống
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="mb-8 max-w-lg mx-auto"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-20 py-3 text-lg"
                        />
                        <Button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            size="sm"
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                </form>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {search
                                ? "Không tìm thấy bài viết"
                                : "Chưa có bài viết nào"}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {search
                                ? "Thử thay đổi từ khóa tìm kiếm"
                                : "Hãy quay lại sau để đọc những bài viết mới nhất"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blogs/${post.slug}`}
                                    className="block"
                                >
                                    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer">
                                        {/* Cover Image */}
                                        {post.cover_image_url && (
                                            <div className="aspect-video overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={post.cover_image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        const target =
                                                            e.target as HTMLImageElement;
                                                        target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="p-6">
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {formatDate(
                                                            post.published_at ||
                                                                post.created_at
                                                        )}
                                                    </span>
                                                </div>
                                                {post.reading_time_minutes && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {
                                                                post.reading_time_minutes
                                                            }{" "}
                                                            phút đọc
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                                {getExcerpt(post)}
                                            </p>

                                            {/* Read More */}
                                            <div className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                                Đọc tiếp
                                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function PostsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4 py-8">
                        <div className="animate-pulse">
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white dark:bg-gray-800 rounded-lg p-6"
                                    >
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <PostsPageContent />
        </Suspense>
    );
}
