import { getSupabaseServerClient } from "../server-client";
import type {
    Tag,
    CreateTagInput,
    UpdateTagInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchTags(
    params: PaginationParams = {}
): Promise<PaginatedResponse<Tag>> {
    const supabase = getSupabaseServerClient();
    const {
        page = 1,
        limit = 10,
        sort_by = "name",
        sort_order = "asc",
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("tags")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as Tag[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchAllTags(): Promise<Tag[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Tag[];
}

export async function fetchTagById(id: number): Promise<Tag | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Tag | null;
}

export async function fetchTagBySlug(slug: string): Promise<Tag | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) throw error;
    return data as Tag | null;
}

export async function createTag(input: CreateTagInput): Promise<Tag> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("tags")
        .insert({
            slug: input.slug,
            name: input.name,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Tag;
}

export async function updateTag(input: UpdateTagInput): Promise<Tag> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("tags")
        .update({
            slug: input.slug,
            name: input.name,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Tag;
}

export async function deleteTag(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("tags").delete().eq("id", id);

    if (error) throw error;
}
