import { getSupabaseServerClient } from "../server-client";
import type { PostTag } from "../types";

export async function fetchPostTagsByPost(postId: number): Promise<PostTag[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("post_tags")
        .select("*")
        .eq("post_id", postId);

    if (error) throw error;
    return (data ?? []) as PostTag[];
}

export async function fetchPostTagsByTag(tagId: number): Promise<PostTag[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("post_tags")
        .select("*")
        .eq("tag_id", tagId);

    if (error) throw error;
    return (data ?? []) as PostTag[];
}

export async function createPostTag(
    postId: number,
    tagId: number
): Promise<PostTag> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("post_tags")
        .insert({
            post_id: postId,
            tag_id: tagId,
        })
        .select()
        .single();

    if (error) throw error;
    return data as PostTag;
}

export async function deletePostTag(
    postId: number,
    tagId: number
): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("post_tags")
        .delete()
        .eq("post_id", postId)
        .eq("tag_id", tagId);

    if (error) throw error;
}

export async function deleteAllPostTags(postId: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("post_tags")
        .delete()
        .eq("post_id", postId);

    if (error) throw error;
}
