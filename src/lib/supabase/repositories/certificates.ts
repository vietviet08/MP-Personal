import { getSupabaseServerClient } from "../server-client";
import type {
    Certificate,
    CreateCertificateInput,
    UpdateCertificateInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchCertificates(
    params: PaginationParams = {}
): Promise<PaginatedResponse<Certificate>> {
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
        .from("certificates")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as Certificate[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchPublishedCertificates(): Promise<Certificate[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Certificate[];
}

export async function fetchCertificateById(
    id: number
): Promise<Certificate | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Certificate | null;
}

export async function createCertificate(
    input: CreateCertificateInput
): Promise<Certificate> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("certificates")
        .insert({
            name: input.name,
            issuer: input.issuer ?? null,
            issue_date: input.issue_date ?? null,
            expires_at: input.expires_at ?? null,
            credential_id: input.credential_id ?? null,
            credential_url: input.credential_url ?? null,
            image_url: input.image_url ?? null,
            published: input.published ?? true,
            sort_order: input.sort_order ?? 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Certificate;
}

export async function updateCertificate(
    input: UpdateCertificateInput
): Promise<Certificate> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("certificates")
        .update({
            name: input.name,
            issuer: input.issuer,
            issue_date: input.issue_date,
            expires_at: input.expires_at,
            credential_id: input.credential_id,
            credential_url: input.credential_url,
            image_url: input.image_url,
            published: input.published,
            sort_order: input.sort_order,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Certificate;
}

export async function deleteCertificate(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("certificates").delete().eq("id", id);

    if (error) throw error;
}
