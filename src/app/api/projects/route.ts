import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { verifyPublicAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        // Optional authentication for analytics
        const { user } = await verifyPublicAuth(request);

        const supabase = getSupabaseServerClient();
        const { searchParams } = new URL(request.url);

        // Get query parameters
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const featured = searchParams.get("featured") === "true";
        const status = searchParams.get("status") || "published";

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Build query - only show published projects
        let query = supabase
            .from("projects")
            .select(
                "id, slug, title, short_description, content, repo_url, live_url, cover_image_url, featured, status, start_date, end_date, order_index, created_at",
                {
                    count: "exact",
                }
            )
            .eq("status", status); // Only show projects with specified status

        // Filter by featured if requested
        if (featured) {
            query = query.eq("featured", true);
        }

        // Add sorting by order_index and created_at
        query = query
            .order("order_index", { ascending: true })
            .order("created_at", { ascending: false });

        // Add pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch projects" },
                { status: 500 }
            );
        }

        // Calculate pagination info
        const totalPages = Math.ceil((count || 0) / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Log analytics if user is authenticated
        if (user) {
            // You can log project views here for analytics
            console.log(`Authenticated user ${user.id} viewed projects`);
        }

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
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
