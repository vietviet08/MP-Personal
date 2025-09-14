import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { verifyAdminAuth } from "@/lib/auth";
import { CreatePostInput, UpdatePostInput } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
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
        const { searchParams } = new URL(request.url);

        // Get query parameters
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "created_at";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from("posts")
            .select(
                "id, slug, title, excerpt, content, cover_image_url, status, reading_time_minutes, published_at, created_at, updated_at",
                {
                    count: "exact",
                }
            );

        // Add search filter if provided
        if (search) {
            query = query.or(
                `title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`
            );
        }

        // Add sorting
        const ascending = sortOrder === "asc";
        query = query.order(sortBy, { ascending });

        // Add pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch posts" },
                { status: 500 }
            );
        }

        // Calculate pagination info
        const totalPages = Math.ceil((count || 0) / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json({
            data: data || [],
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: count || 0,
                itemsPerPage: limit,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
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
        const body: CreatePostInput = await request.json();

        // Validate required fields
        if (!body.title || !body.slug) {
            return NextResponse.json(
                { error: "Title and slug are required" },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const { data: existingPost } = await supabase
            .from("posts")
            .select("id")
            .eq("slug", body.slug)
            .single();

        if (existingPost) {
            return NextResponse.json(
                { error: "A post with this slug already exists" },
                { status: 400 }
            );
        }

        // Create the post
        const { data, error } = await supabase
            .from("posts")
            .insert([body])
            .select()
            .single();

        if (error) {
            console.error("Create error:", error);
            return NextResponse.json(
                { error: "Failed to create post" },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
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
        const body: UpdatePostInput = await request.json();

        // Validate required fields
        if (!body.id) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Check if post exists
        const { data: existingPost } = await supabase
            .from("posts")
            .select("id")
            .eq("id", body.id)
            .single();

        if (!existingPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Check if slug already exists (excluding current post)
        if (body.slug) {
            const { data: slugExists } = await supabase
                .from("posts")
                .select("id")
                .eq("slug", body.slug)
                .neq("id", body.id)
                .single();

            if (slugExists) {
                return NextResponse.json(
                    { error: "A post with this slug already exists" },
                    { status: 400 }
                );
            }
        }

        // Update the post
        const { id, ...updateData } = body;
        const { data, error } = await supabase
            .from("posts")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Update error:", error);
            return NextResponse.json(
                { error: "Failed to update post" },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
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
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        const { error } = await supabase.from("posts").delete().eq("id", id);

        if (error) {
            console.error("Delete error:", error);
            return NextResponse.json(
                { error: "Failed to delete post" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
