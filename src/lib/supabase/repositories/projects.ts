import { getSupabaseServerClient } from "../server-client";

export type Project = {
    id: number;
    slug: string;
    title: string;
    short_description: string | null;
    cover_image_url: string | null;
    featured: boolean;
    status: "draft" | "published" | "archived";
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
};

export async function fetchPublishedProjects(): Promise<Project[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("projects")
        .select(
            [
                "id",
                "slug",
                "title",
                "short_description",
                "cover_image_url",
                "featured",
                "status",
                "start_date",
                "end_date",
                "created_at",
                "updated_at",
            ].join(", ")
        )
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("order_index", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as unknown as Project[];
}

export async function fetchProjectBySlug(
    slug: string
): Promise<Project | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) throw error;
    return (data as Project | null) ?? null;
}
