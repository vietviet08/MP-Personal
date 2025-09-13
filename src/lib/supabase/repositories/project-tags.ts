import { getSupabaseServerClient } from "../server-client";
import type { ProjectTag } from "../types";

export async function fetchProjectTagsByProject(
    projectId: number
): Promise<ProjectTag[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_tags")
        .select("*")
        .eq("project_id", projectId);

    if (error) throw error;
    return (data ?? []) as ProjectTag[];
}

export async function fetchProjectTagsByTag(
    tagId: number
): Promise<ProjectTag[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_tags")
        .select("*")
        .eq("tag_id", tagId);

    if (error) throw error;
    return (data ?? []) as ProjectTag[];
}

export async function createProjectTag(
    projectId: number,
    tagId: number
): Promise<ProjectTag> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_tags")
        .insert({
            project_id: projectId,
            tag_id: tagId,
        })
        .select()
        .single();

    if (error) throw error;
    return data as ProjectTag;
}

export async function deleteProjectTag(
    projectId: number,
    tagId: number
): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("project_tags")
        .delete()
        .eq("project_id", projectId)
        .eq("tag_id", tagId);

    if (error) throw error;
}

export async function deleteAllProjectTags(projectId: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("project_tags")
        .delete()
        .eq("project_id", projectId);

    if (error) throw error;
}
