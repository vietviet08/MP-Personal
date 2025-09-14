"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Post,
    CreatePostInput,
    UpdatePostInput,
    PostStatus,
    Tag,
} from "@/lib/supabase/types";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { X, Plus, Save } from "lucide-react";

interface PostFormProps {
    post?: Post;
    onSuccess?: () => void;
    onCancel?: () => void;
    mode: "create" | "edit";
}

interface AIGeneratedContent {
    title: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
}

interface PostFormRef {
    populateWithAI: (data: AIGeneratedContent) => void;
}

const PostForm = forwardRef<PostFormRef, PostFormProps>(function PostForm(
    { post, onSuccess, onCancel, mode },
    ref
) {
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState("");
    const [showNewTagInput, setShowNewTagInput] = useState(false);
    const [selectValue, setSelectValue] = useState<string>("");

    const [formData, setFormData] = useState<CreatePostInput>({
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        cover_image_url: "",
        status: "draft",
        reading_time_minutes: undefined,
        published_at: undefined,
    });

    // Expose methods to parent component
    useImperativeHandle(
        ref,
        () => ({
            populateWithAI: (data: AIGeneratedContent) => {
                if (!data) {
                    console.error("populateWithAI called with undefined data");
                    return;
                }

                if (!data.title || !data.content) {
                    console.error(
                        "populateWithAI called with incomplete data:",
                        data
                    );
                    return;
                }

                setFormData((prev) => ({
                    ...prev,
                    title: data.title,
                    slug: generateSlug(data.title),
                    excerpt: data.excerpt || "",
                    content: data.content,
                    cover_image_url: data.cover_image_url || "",
                    reading_time_minutes: data.content
                        ? calculateReadingTime(data.content)
                        : undefined,
                }));
            },
        }),
        []
    );

    // Load available tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await apiClient.get(
                    "/api/admin/tags?limit=100"
                );
                const tags = response.data || [];
                setAvailableTags(tags);
            } catch {}
        };
        fetchTags();
    }, []);

    // Initialize form data when editing
    useEffect(() => {
        if (post && mode === "edit") {
            setFormData({
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt || "",
                content: post.content || "",
                cover_image_url: post.cover_image_url || "",
                status: post.status,
                reading_time_minutes: post.reading_time_minutes,
                published_at: post.published_at,
            });

            // Load existing tags for the post
            const fetchPostTags = async () => {
                try {
                    const response = await apiClient.get(
                        `/api/admin/posts/${post.id}/tags`
                    );
                    if (response.data && Array.isArray(response.data)) {
                        const postTags = response.data
                            .map((item: { tags: Tag }) => item.tags)
                            .filter((tag: Tag) => tag && tag.id && tag.name);
                        setSelectedTags(postTags);
                    } else {
                        setSelectedTags([]);
                    }
                } catch {
                    setSelectedTags([]);
                }
            };
            fetchPostTags();
        }
    }, [post, mode]);

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleInputChange = (
        field: keyof CreatePostInput,
        value: string | number | undefined
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Auto-generate slug when title changes
        if (field === "title" && typeof value === "string") {
            setFormData((prev) => ({
                ...prev,
                slug: generateSlug(value),
            }));
        }
    };

    const handleAddTag = (tag: Tag) => {
        if (
            tag &&
            tag.id &&
            tag.name &&
            !selectedTags.find((t) => t.id === tag.id)
        ) {
            setSelectedTags((prev) => [...prev, tag]);
        }
    };

    const handleRemoveTag = (tagId: number) => {
        setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
    };

    const handleCreateNewTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const slug = generateSlug(newTagName);
            const response = await apiClient.post("/api/admin/tags", {
                name: newTagName.trim(),
                slug: slug,
            });

            const newTag = response.data;
            if (newTag && newTag.id && newTag.name) {
                // Cập nhật danh sách available tags
                setAvailableTags((prev) => {
                    // Kiểm tra xem tag đã tồn tại chưa để tránh duplicate
                    const exists = prev.find((tag) => tag.id === newTag.id);
                    if (exists) {
                        return prev;
                    }
                    const updated = [...prev, newTag];
                    return updated;
                });

                // Thêm tag mới vào selected tags
                setSelectedTags((prev) => {
                    // Kiểm tra xem tag đã được chọn chưa để tránh duplicate
                    const exists = prev.find((tag) => tag.id === newTag.id);
                    if (exists) {
                        return prev;
                    }
                    const updated = [...prev, newTag];
                    return updated;
                });

                // Reset form và ẩn input tạo tag mới
                setNewTagName("");
                setShowNewTagInput(false);
                // Reset select value để clear dropdown
                setSelectValue("");
                // Hiển thị toast success
                showSuccess(`Tag "${newTag.name}" created successfully!`);
            } else {
                // Reset form ngay cả khi có lỗi
                setNewTagName("");
                setShowNewTagInput(false);
                setSelectValue("");
                showError("Invalid tag data received from server");
            }
        } catch (error) {
            // Reset form ngay cả khi có lỗi
            setNewTagName("");
            setShowNewTagInput(false);
            setSelectValue("");

            // Show more detailed error message
            let errorMessage = `Failed to create tag "${newTagName.trim()}".`;
            if (error instanceof Error) {
                errorMessage += ` Error: ${error.message}`;
            }
            showError(errorMessage);
        }
    };

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            content,
            reading_time_minutes: content
                ? calculateReadingTime(content)
                : undefined,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (mode === "create") {
                response = await apiClient.post(
                    "/api/admin/posts",
                    formData as unknown as Record<string, unknown>
                );
            } else {
                const updateData: UpdatePostInput = {
                    id: post!.id,
                    ...formData,
                };
                response = await apiClient.put(
                    "/api/admin/posts",
                    updateData as unknown as Record<string, unknown>
                );
            }

            const savedPost = response.data;

            // Handle tags if any are selected
            if (selectedTags.length > 0) {
                const tagIds = selectedTags.map((tag) => tag.id);
                await apiClient.post(`/api/admin/posts/${savedPost.id}/tags`, {
                    tag_ids: tagIds,
                });
            }

            showSuccess(
                mode === "create"
                    ? "Post created successfully"
                    : "Post updated successfully"
            );

            if (onSuccess) {
                onSuccess();
            }
        } catch {
            showError(
                `Failed to ${mode === "create" ? "create" : "update"} post`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mode === "create" ? "Create New Post" : "Edit Post"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {mode === "create"
                        ? "Fill in the details to create a new blog post"
                        : "Update the post details below"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title and Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <Input
                            value={formData.title}
                            onChange={(e) =>
                                handleInputChange("title", e.target.value)
                            }
                            placeholder="Enter post title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Slug *
                        </label>
                        <Input
                            value={formData.slug}
                            onChange={(e) =>
                                handleInputChange("slug", e.target.value)
                            }
                            placeholder="post-slug"
                            required
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Excerpt
                    </label>
                    <Textarea
                        value={formData.excerpt}
                        onChange={(e) =>
                            handleInputChange("excerpt", e.target.value)
                        }
                        placeholder="Brief description of the post"
                        rows={3}
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content *
                    </label>
                    <Textarea
                        value={formData.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Write your post content here..."
                        rows={12}
                        required
                    />
                    {formData.reading_time_minutes && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Estimated reading time:{" "}
                            {formData.reading_time_minutes} minutes
                        </p>
                    )}
                </div>

                {/* Cover Image URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cover Image URL
                    </label>
                    <Input
                        value={formData.cover_image_url}
                        onChange={(e) =>
                            handleInputChange("cover_image_url", e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                {/* Status and Published Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                        </label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: PostStatus) =>
                                handleInputChange("status", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">
                                    Published
                                </SelectItem>
                                <SelectItem value="archived">
                                    Archived
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Published Date
                        </label>
                        <Input
                            type="datetime-local"
                            value={
                                formData.published_at
                                    ? new Date(formData.published_at)
                                          .toISOString()
                                          .slice(0, 16)
                                    : ""
                            }
                            onChange={(e) =>
                                handleInputChange(
                                    "published_at",
                                    e.target.value
                                        ? new Date(e.target.value).toISOString()
                                        : undefined
                                )
                            }
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                    </label>
                    <div className="space-y-3">
                        {/* Selected Tags */}
                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedTags
                                    .filter((tag) => tag && tag.id && tag.name)
                                    .map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {tag.name}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveTag(tag.id)
                                                }
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                            </div>
                        )}

                        {/* Add Tag Dropdown */}
                        <div className="flex gap-2">
                            <Select
                                value={selectValue}
                                onValueChange={(value: string) => {
                                    const tag = availableTags.find(
                                        (t) => t.id === parseInt(value)
                                    );
                                    if (tag) {
                                        handleAddTag(tag);
                                        setSelectValue(""); // Reset select sau khi chọn
                                    }
                                }}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select a tag to add" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTags
                                        .filter(
                                            (tag) =>
                                                tag &&
                                                tag.id &&
                                                tag.name &&
                                                !selectedTags.find(
                                                    (t) => t && t.id === tag.id
                                                )
                                        )
                                        .map((tag) => (
                                            <SelectItem
                                                key={tag.id}
                                                value={tag.id.toString()}
                                            >
                                                {tag.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>

                            {!showNewTagInput ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowNewTagInput(true)}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    New Tag
                                </Button>
                            ) : (
                                <div className="flex gap-2 flex-1">
                                    <Input
                                        value={newTagName}
                                        onChange={(e) =>
                                            setNewTagName(e.target.value)
                                        }
                                        placeholder="New tag name"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleCreateNewTag}
                                        disabled={!newTagName.trim()}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowNewTagInput(false);
                                            setNewTagName("");
                                            setSelectValue("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={
                            loading ||
                            !formData.title ||
                            !formData.slug ||
                            !formData.content
                        }
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {mode === "create" ? "Create Post" : "Update Post"}
                    </Button>
                </div>
            </form>
        </div>
    );
});

export default PostForm;
