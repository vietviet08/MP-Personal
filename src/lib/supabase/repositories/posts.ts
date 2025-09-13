import { getSupabaseServerClient } from "../server-client";
import type {
    Post,
    CreatePostInput,
    UpdatePostInput,
    PaginatedResponse,
    PostFilters,
} from "../types";

export async function fetchPosts(
    params: PostFilters = {}
): Promise<PaginatedResponse<Post>> {
    const supabase = getSupabaseServerClient();
    const {
        page = 1,
        limit = 10,
        sort_by = "created_at",
        sort_order = "desc",
        status,
        search,
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("posts")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (status) {
        query = query.eq("status", status);
    }

    if (search) {
        query = query.or(
            `title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`
        );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        data: (data ?? []) as Post[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchPublishedPosts(): Promise<Post[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data ?? []) as Post[];
}

export async function fetchPostById(id: number): Promise<Post | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Post | null;
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) throw error;
    return data as Post | null;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("posts")
        .insert({
            slug: input.slug,
            title: input.title,
            excerpt: input.excerpt ?? null,
            content: input.content ?? null,
            cover_image_url: input.cover_image_url ?? null,
            status: input.status ?? "draft",
            reading_time_minutes: input.reading_time_minutes ?? null,
            published_at: input.published_at ?? null,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Post;
}

export async function updatePost(input: UpdatePostInput): Promise<Post> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("posts")
        .update({
            slug: input.slug,
            title: input.title,
            excerpt: input.excerpt,
            content: input.content,
            cover_image_url: input.cover_image_url,
            status: input.status,
            reading_time_minutes: input.reading_time_minutes,
            published_at: input.published_at,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Post;
}

export async function deletePost(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
}
