import { getSupabaseServerClient } from "../server-client";
import type {
    Testimonial,
    CreateTestimonialInput,
    UpdateTestimonialInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchTestimonials(
    params: PaginationParams = {}
): Promise<PaginatedResponse<Testimonial>> {
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
        .from("testimonials")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as Testimonial[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Testimonial[];
}

export async function fetchTestimonialById(
    id: number
): Promise<Testimonial | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Testimonial | null;
}

export async function createTestimonial(
    input: CreateTestimonialInput
): Promise<Testimonial> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("testimonials")
        .insert({
            author_name: input.author_name,
            author_role: input.author_role ?? null,
            company: input.company ?? null,
            avatar_url: input.avatar_url ?? null,
            content: input.content,
            published: input.published ?? true,
            sort_order: input.sort_order ?? 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Testimonial;
}

export async function updateTestimonial(
    input: UpdateTestimonialInput
): Promise<Testimonial> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("testimonials")
        .update({
            author_name: input.author_name,
            author_role: input.author_role,
            company: input.company,
            avatar_url: input.avatar_url,
            content: input.content,
            published: input.published,
            sort_order: input.sort_order,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Testimonial;
}

export async function deleteTestimonial(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) throw error;
}
