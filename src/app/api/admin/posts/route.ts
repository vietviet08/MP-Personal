import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { verifyAdminAuth } from "@/lib/auth";

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
