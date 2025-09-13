import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import {
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
} from "@/lib/supabase/repositories/tags";
import type { CreateTagInput, UpdateTagInput } from "@/lib/supabase/types";

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

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const sort_by = searchParams.get("sort_by") || "name";
        const sort_order = (searchParams.get("sort_order") || "asc") as
            | "asc"
            | "desc";

        const result = await fetchTags({
            page,
            limit,
            sort_by,
            sort_order,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching tags:", error);
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

        const body: CreateTagInput = await request.json();

        // Validate required fields
        if (!body.name || !body.slug) {
            return NextResponse.json(
                { error: "Tag name and slug are required" },
                { status: 400 }
            );
        }

        const tag = await createTag(body);

        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        console.error("Error creating tag:", error);
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

        const body: UpdateTagInput = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: "Tag ID is required" },
                { status: 400 }
            );
        }

        const tag = await updateTag(body);

        return NextResponse.json(tag);
    } catch (error) {
        console.error("Error updating tag:", error);
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

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Tag ID is required" },
                { status: 400 }
            );
        }

        await deleteTag(parseInt(id));

        return NextResponse.json({ message: "Tag deleted successfully" });
    } catch (error) {
        console.error("Error deleting tag:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
