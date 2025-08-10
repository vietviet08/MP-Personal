import { getSupabaseServerClient } from "../server-client";

export type Post = {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    cover_image_url: string | null;
    status: "draft" | "published" | "archived";
    reading_time_minutes: number | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
};

export async function fetchPublishedPosts(): Promise<Post[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("posts")
        .select(
            [
                "id",
                "slug",
                "title",
                "excerpt",
                "cover_image_url",
                "status",
                "reading_time_minutes",
                "published_at",
                "created_at",
                "updated_at",
            ].join(", ")
        )
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data ?? []) as unknown as Post[];
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) throw error;
    return (data as Post | null) ?? null;
}
