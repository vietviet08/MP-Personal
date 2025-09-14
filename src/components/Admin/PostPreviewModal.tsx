"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Calendar, Clock, User } from "lucide-react";
import { Post } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";

interface PostPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

export function PostPreviewModal({
    isOpen,
    onClose,
    post,
}: PostPreviewModalProps) {
    if (!post) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "draft":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "archived":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "published":
                return "Đã xuất bản";
            case "draft":
                return "Nháp";
            case "archived":
                return "Lưu trữ";
            default:
                return status;
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-white/10 backdrop-blur-lg" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                                    >
                                        Post Preview
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="ml-auto bg-white dark:bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Preview Content */}
                                <div className="max-h-[80vh] overflow-y-auto">
                                    {/* Blog Post Style Preview */}
                                    <article className="max-w-3xl mx-auto py-8 px-6">
                                        {/* Cover Image */}
                                        {post.cover_image_url && (
                                            <div className="mb-8">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={post.cover_image_url}
                                                    alt={post.title}
                                                    className="w-full h-64 object-cover rounded-lg shadow-md"
                                                    onError={(e) => {
                                                        // Hide image if it fails to load
                                                        const target =
                                                            e.target as HTMLImageElement;
                                                        target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Header */}
                                        <header className="mb-8">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Badge
                                                    className={getStatusColor(
                                                        post.status
                                                    )}
                                                    variant="secondary"
                                                >
                                                    {getStatusText(post.status)}
                                                </Badge>
                                            </div>

                                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                                {post.title}
                                            </h1>

                                            {post.excerpt && (
                                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* Meta Information */}
                                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    <span>Admin</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {post.published_at
                                                            ? formatDate(
                                                                  post.published_at
                                                              )
                                                            : formatDate(
                                                                  post.created_at
                                                              )}
                                                    </span>
                                                </div>

                                                {post.reading_time_minutes && (
                                                    <div className="flex items-center gap-2">
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
                                        </header>

                                        {/* Content */}
                                        <div className="prose prose-lg dark:prose-invert max-w-none">
                                            <div
                                                className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap"
                                                style={{
                                                    lineHeight: "1.8",
                                                    fontSize: "1.125rem",
                                                }}
                                            >
                                                {post.content}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                <p>
                                                    Slug:{" "}
                                                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                        {post.slug}
                                                    </code>
                                                </p>
                                                <p className="mt-2">
                                                    Tạo lúc:{" "}
                                                    {formatDate(
                                                        post.created_at
                                                    )}
                                                    {post.updated_at !==
                                                        post.created_at && (
                                                        <>
                                                            {" "}
                                                            • Cập nhật:{" "}
                                                            {formatDate(
                                                                post.updated_at
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </footer>
                                    </article>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
