import { getSupabaseServerClient } from "../server-client";
import type {
    Project,
    CreateProjectInput,
    UpdateProjectInput,
    PaginatedResponse,
    ProjectFilters,
} from "../types";

export async function fetchProjects(
    params: ProjectFilters = {}
): Promise<PaginatedResponse<Project>> {
    const supabase = getSupabaseServerClient();
    const {
        page = 1,
        limit = 10,
        sort_by = "order_index",
        sort_order = "asc",
        status,
        featured,
        search,
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("projects")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (status) {
        query = query.eq("status", status);
    }

    if (featured !== undefined) {
        query = query.eq("featured", featured);
    }

    if (search) {
        query = query.or(
            `title.ilike.%${search}%,short_description.ilike.%${search}%,content.ilike.%${search}%`
        );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        data: (data ?? []) as Project[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchPublishedProjects(): Promise<Project[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("order_index", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Project[];
}

export async function fetchProjectById(id: number): Promise<Project | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Project | null;
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
    return data as Project | null;
}

export async function createProject(
    input: CreateProjectInput
): Promise<Project> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("projects")
        .insert({
            slug: input.slug,
            title: input.title,
            short_description: input.short_description ?? null,
            content: input.content ?? null,
            repo_url: input.repo_url ?? null,
            live_url: input.live_url ?? null,
            cover_image_url: input.cover_image_url ?? null,
            featured: input.featured ?? false,
            status: input.status ?? "draft",
            start_date: input.start_date ?? null,
            end_date: input.end_date ?? null,
            order_index: input.order_index ?? 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Project;
}

export async function updateProject(
    input: UpdateProjectInput
): Promise<Project> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("projects")
        .update({
            slug: input.slug,
            title: input.title,
            short_description: input.short_description,
            content: input.content,
            repo_url: input.repo_url,
            live_url: input.live_url,
            cover_image_url: input.cover_image_url,
            featured: input.featured,
            status: input.status,
            start_date: input.start_date,
            end_date: input.end_date,
            order_index: input.order_index,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Project;
}

export async function deleteProject(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;
}
