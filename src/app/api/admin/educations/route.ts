import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import {
    fetchEducations,
    createEducation,
    updateEducation,
    deleteEducation,
} from "@/lib/supabase/repositories/educations";
import type {
    CreateEducationInput,
    UpdateEducationInput,
} from "@/lib/supabase/types";

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
        const sort_by = searchParams.get("sort_by") || "sort_order";
        const sort_order = (searchParams.get("sort_order") || "asc") as
            | "asc"
            | "desc";

        const result = await fetchEducations({
            page,
            limit,
            sort_by,
            sort_order,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching educations:", error);
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

        const body: CreateEducationInput = await request.json();

        // Validate required fields
        if (!body.school) {
            return NextResponse.json(
                { error: "School name is required" },
                { status: 400 }
            );
        }

        const education = await createEducation(body);

        return NextResponse.json(education, { status: 201 });
    } catch (error) {
        console.error("Error creating education:", error);
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

        const body: UpdateEducationInput = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: "Education ID is required" },
                { status: 400 }
            );
        }

        const education = await updateEducation(body);

        return NextResponse.json(education);
    } catch (error) {
        console.error("Error updating education:", error);
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
                { error: "Education ID is required" },
                { status: 400 }
            );
        }

        await deleteEducation(parseInt(id));

        return NextResponse.json({ message: "Education deleted successfully" });
    } catch (error) {
        console.error("Error deleting education:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
