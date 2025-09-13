import { getSupabaseServerClient } from "../server-client";
import type {
    Education,
    CreateEducationInput,
    UpdateEducationInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchEducations(
    params: PaginationParams = {}
): Promise<PaginatedResponse<Education>> {
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
        .from("educations")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as Education[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchAllEducations(): Promise<Education[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("educations")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Education[];
}

export async function fetchEducationById(
    id: number
): Promise<Education | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("educations")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Education | null;
}

export async function createEducation(
    input: CreateEducationInput
): Promise<Education> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("educations")
        .insert({
            school: input.school,
            degree: input.degree ?? null,
            field: input.field ?? null,
            start_date: input.start_date ?? null,
            end_date: input.end_date ?? null,
            logo_url: input.logo_url ?? null,
            sort_order: input.sort_order ?? 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Education;
}

export async function updateEducation(
    input: UpdateEducationInput
): Promise<Education> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("educations")
        .update({
            school: input.school,
            degree: input.degree,
            field: input.field,
            start_date: input.start_date,
            end_date: input.end_date,
            logo_url: input.logo_url,
            sort_order: input.sort_order,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Education;
}

export async function deleteEducation(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("educations").delete().eq("id", id);

    if (error) throw error;
}
