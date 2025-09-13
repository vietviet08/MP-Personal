import { getSupabaseServerClient } from "../server-client";
import type {
    Experience,
    CreateExperienceInput,
    UpdateExperienceInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchExperiences(
    params: PaginationParams = {}
): Promise<PaginatedResponse<Experience>> {
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
        .from("experiences")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as Experience[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchAllExperiences(): Promise<Experience[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Experience[];
}

export async function fetchExperienceById(
    id: number
): Promise<Experience | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Experience | null;
}

export async function createExperience(
    input: CreateExperienceInput
): Promise<Experience> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("experiences")
        .insert({
            company: input.company,
            role: input.role,
            location: input.location ?? null,
            start_date: input.start_date,
            end_date: input.end_date ?? null,
            description: input.description ?? null,
            highlights: input.highlights ?? null,
            logo_url: input.logo_url ?? null,
            sort_order: input.sort_order ?? 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Experience;
}

export async function updateExperience(
    input: UpdateExperienceInput
): Promise<Experience> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("experiences")
        .update({
            company: input.company,
            role: input.role,
            location: input.location,
            start_date: input.start_date,
            end_date: input.end_date,
            description: input.description,
            highlights: input.highlights,
            logo_url: input.logo_url,
            sort_order: input.sort_order,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Experience;
}

export async function deleteExperience(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("experiences").delete().eq("id", id);

    if (error) throw error;
}
