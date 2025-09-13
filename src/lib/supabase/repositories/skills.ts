import { getSupabaseServerClient } from "../server-client";
import type {
    Skill,
    CreateSkillInput,
    UpdateSkillInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchSkills(
    params: PaginationParams = {}
): Promise<PaginatedResponse<Skill>> {
    const supabase = getSupabaseServerClient();
    const {
        page = 1,
        limit = 10,
        sort_by = "name",
        sort_order = "asc",
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("skills")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as Skill[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchAllSkills(): Promise<Skill[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Skill[];
}

export async function fetchSkillsByCategory(
    category: string
): Promise<Skill[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("category", category)
        .order("name", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Skill[];
}

export async function fetchSkillById(id: number): Promise<Skill | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as Skill | null;
}

export async function createSkill(input: CreateSkillInput): Promise<Skill> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("skills")
        .insert({
            name: input.name,
            category: input.category ?? null,
            level: input.level ?? null,
            icon_url: input.icon_url ?? null,
        })
        .select()
        .single();

    if (error) throw error;
    return data as Skill;
}

export async function updateSkill(input: UpdateSkillInput): Promise<Skill> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("skills")
        .update({
            name: input.name,
            category: input.category,
            level: input.level,
            icon_url: input.icon_url,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as Skill;
}

export async function deleteSkill(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) throw error;
}
