import { getSupabaseServerClient } from "../server-client";
import type {
    Profile,
    CreateProfileInput,
    UpdateProfileInput,
    ProfileWithSocialLinks,
} from "../types";

export async function fetchProfileById(id: string): Promise<Profile | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Profile | null;
}

export async function fetchProfileWithSocialLinks(
    id: string
): Promise<ProfileWithSocialLinks | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select(
            `
      *,
      social_links (*)
    `
        )
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as ProfileWithSocialLinks | null;
}

export async function createProfile(
    input: CreateProfileInput
): Promise<Profile> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .insert({
            id: input.id,
            full_name: input.full_name,
            headline: input.headline ?? null,
            bio: input.bio ?? null,
            avatar_url: input.avatar_url ?? null,
            location: input.location ?? null,
            email_public: input.email_public ?? null,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Profile;
}

export async function updateProfile(
    input: UpdateProfileInput
): Promise<Profile> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .update({
            full_name: input.full_name,
            headline: input.headline,
            bio: input.bio,
            avatar_url: input.avatar_url,
            location: input.location,
            email_public: input.email_public,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Profile;
}

export async function deleteProfile(id: string): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) throw error;
}
