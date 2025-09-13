import { getSupabaseServerClient } from "../server-client";
import type {
    ProjectImage,
    CreateProjectImageInput,
    UpdateProjectImageInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchProjectImages(
    params: PaginationParams = {}
): Promise<PaginatedResponse<ProjectImage>> {
    const supabase = getSupabaseServerClient();
    const {
        page = 1,
        limit = 10,
        sort_by = "sort_order",
        sort_order = "asc",
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("project_images")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as ProjectImage[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchProjectImagesByProject(
    projectId: number
): Promise<ProjectImage[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as ProjectImage[];
}

export async function fetchProjectImageById(
    id: number
): Promise<ProjectImage | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as ProjectImage | null;
}

export async function createProjectImage(
    input: CreateProjectImageInput
): Promise<ProjectImage> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_images")
        .insert({
            project_id: input.project_id,
            image_url: input.image_url,
            alt: input.alt ?? null,
            sort_order: input.sort_order ?? 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as ProjectImage;
}

export async function updateProjectImage(
    input: UpdateProjectImageInput
): Promise<ProjectImage> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_images")
        .update({
            project_id: input.project_id,
            image_url: input.image_url,
            alt: input.alt,
            sort_order: input.sort_order,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as ProjectImage;
}

export async function deleteProjectImage(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("project_images")
        .delete()
        .eq("id", id);

    if (error) throw error;
}
