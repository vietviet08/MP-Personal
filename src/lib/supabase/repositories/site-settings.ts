import { getSupabaseServerClient } from "../server-client";
import type {
    SiteSetting,
    CreateSiteSettingInput,
    UpdateSiteSettingInput,
} from "../types";

export async function fetchAllSiteSettings(): Promise<SiteSetting[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("key", { ascending: true });

    if (error) throw error;
    return (data ?? []) as SiteSetting[];
}

export async function fetchPublicSiteSettings(): Promise<SiteSetting[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("is_public", true)
        .order("key", { ascending: true });

    if (error) throw error;
    return (data ?? []) as SiteSetting[];
}

export async function fetchSiteSettingByKey(
    key: string
): Promise<SiteSetting | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();

    if (error) throw error;
    return data as SiteSetting | null;
}

export async function createSiteSetting(
    input: CreateSiteSettingInput
): Promise<SiteSetting> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("site_settings")
        .insert({
            key: input.key,
            value: input.value,
            is_public: input.is_public ?? true,
        })
        .select()
        .single();

    if (error) throw error;
    return data as SiteSetting;
}

export async function updateSiteSetting(
    input: UpdateSiteSettingInput
): Promise<SiteSetting> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("site_settings")
        .update({
            value: input.value,
            is_public: input.is_public,
        })
        .eq("key", input.key)
        .select()
        .single();

    if (error) throw error;
    return data as SiteSetting;
}

export async function deleteSiteSetting(key: string): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("site_settings")
        .delete()
        .eq("key", key);

    if (error) throw error;
}
