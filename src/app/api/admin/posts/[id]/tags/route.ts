import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { verifyAdminAuth } from "@/lib/auth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin authentication
        const { error: authError, user } = await verifyAdminAuth(request);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized access. Please login as admin." },
                { status: 401 }
            );
        }

        const supabase = getSupabaseAdminClient();
        const { id } = await params;
        const body = await request.json();
        const { tag_ids } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        if (!tag_ids || !Array.isArray(tag_ids)) {
            return NextResponse.json(
                { error: "Tag IDs array is required" },
                { status: 400 }
            );
        }

        // Check if post exists
        const { data: post } = await supabase
            .from("posts")
            .select("id")
            .eq("id", id)
            .single();

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Delete existing post tags
        const { error: deleteError } = await supabase
            .from("post_tags")
            .delete()
            .eq("post_id", id);

        if (deleteError) {
            console.error("Delete error:", deleteError);
            return NextResponse.json(
                { error: "Failed to remove existing tags" },
                { status: 500 }
            );
        }

        // Insert new post tags
        if (tag_ids.length > 0) {
            const postTags = tag_ids.map((tagId: number) => ({
                post_id: parseInt(id),
                tag_id: tagId,
            }));

            const { error: insertError } = await supabase
                .from("post_tags")
                .insert(postTags);

            if (insertError) {
                console.error("Insert error:", insertError);
                return NextResponse.json(
                    { error: "Failed to add tags" },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating post tags:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin authentication
        const { error: authError, user } = await verifyAdminAuth(request);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized access. Please login as admin." },
                { status: 401 }
            );
        }

        const supabase = getSupabaseAdminClient();
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Get post tags with tag details
        const { data, error } = await supabase
            .from("post_tags")
            .select(
                `
                tag_id,
                tags (
                    id,
                    name,
                    slug
                )
            `
            )
            .eq("post_id", id);

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch post tags" },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: data || [] });
    } catch (error) {
        console.error("Error fetching post tags:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
