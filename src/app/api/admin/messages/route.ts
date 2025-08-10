import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
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
            .from("contact_messages")
            .select("id, name, email, subject, message, created_at", {
                count: "exact",
            });

        // Add search filter if provided
        if (search) {
            query = query.or(
                `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`
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
                { error: "Failed to fetch messages" },
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
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = getSupabaseAdminClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Message ID is required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("contact_messages")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete error:", error);
            return NextResponse.json(
                { error: "Failed to delete message" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
