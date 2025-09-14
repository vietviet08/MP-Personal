import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { verifyPublicAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        // Optional authentication for analytics
        await verifyPublicAuth(request);

        const supabase = getSupabaseServerClient();
        const { searchParams } = new URL(request.url);

        // Get query parameters
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const slug = searchParams.get("slug");

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Build query - only show published posts
        let query = supabase
            .from("posts")
            .select(
                "id, title, content, excerpt, slug, status, reading_time_minutes, published_at, created_at, updated_at",
                {
                    count: "exact",
                }
            )
            .eq("status", "published"); // Only show published posts

        // If specific slug requested, get single post
        if (slug) {
            const { data, error } = await supabase
                .from("posts")
                .select(
                    "id, title, content, excerpt, slug, status, reading_time_minutes, published_at, created_at, updated_at"
                )
                .eq("slug", slug)
                .eq("status", "published")
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    return NextResponse.json(
                        { error: "Post not found" },
                        { status: 404 }
                    );
                }
                console.error("Database error:", error);
                return NextResponse.json(
                    { error: "Failed to fetch post" },
                    { status: 500 }
                );
            }

            // Post found successfully

            return NextResponse.json({ data });
        }

        // Add sorting by published_at and created_at
        query = query
            .order("published_at", { ascending: false })
            .order("created_at", { ascending: false });

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
