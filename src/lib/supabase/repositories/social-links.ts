import { getSupabaseServerClient } from "../server-client";
import type {
    SocialLink,
    CreateSocialLinkInput,
    UpdateSocialLinkInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchSocialLinks(
    params: PaginationParams = {}
): Promise<PaginatedResponse<SocialLink>> {
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
        .from("social_links")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as SocialLink[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchSocialLinksByProfile(
    profileId: string
): Promise<SocialLink[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("profile_id", profileId)
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as SocialLink[];
}

export async function fetchSocialLinkById(
    id: number
): Promise<SocialLink | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as SocialLink | null;
}

export async function createSocialLink(
    input: CreateSocialLinkInput
): Promise<SocialLink> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("social_links")
        .insert({
            profile_id: input.profile_id,
            label: input.label,
            url: input.url,
            sort_order: input.sort_order ?? 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as SocialLink;
}

export async function updateSocialLink(
    input: UpdateSocialLinkInput
): Promise<SocialLink> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("social_links")
        .update({
            profile_id: input.profile_id,
            label: input.label,
            url: input.url,
            sort_order: input.sort_order,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as SocialLink;
}

export async function deleteSocialLink(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("social_links").delete().eq("id", id);

    if (error) throw error;
}
