import { getSupabaseServerClient } from "../server-client";
import type { ProjectSkill } from "../types";

export async function fetchProjectSkillsByProject(
    projectId: number
): Promise<ProjectSkill[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_skills")
        .select("*")
        .eq("project_id", projectId);

    if (error) throw error;
    return (data ?? []) as ProjectSkill[];
}

export async function fetchProjectSkillsBySkill(
    skillId: number
): Promise<ProjectSkill[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_skills")
        .select("*")
        .eq("skill_id", skillId);

    if (error) throw error;
    return (data ?? []) as ProjectSkill[];
}

export async function createProjectSkill(
    projectId: number,
    skillId: number
): Promise<ProjectSkill> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("project_skills")
        .insert({
            project_id: projectId,
            skill_id: skillId,
        })
        .select()
        .single();

    if (error) throw error;
    return data as ProjectSkill;
}

export async function deleteProjectSkill(
    projectId: number,
    skillId: number
): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("project_skills")
        .delete()
        .eq("project_id", projectId)
        .eq("skill_id", skillId);

    if (error) throw error;
}

export async function deleteAllProjectSkills(projectId: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("project_skills")
        .delete()
        .eq("project_id", projectId);

    if (error) throw error;
}
