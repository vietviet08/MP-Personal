import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import {
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} from "@/lib/supabase/repositories/experiences";
import type {
    CreateExperienceInput,
    UpdateExperienceInput,
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

        const result = await fetchExperiences({
            page,
            limit,
            sort_by,
            sort_order,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching experiences:", error);
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

        const body: CreateExperienceInput = await request.json();

        // Validate required fields
        if (!body.company || !body.role || !body.start_date) {
            return NextResponse.json(
                { error: "Company, role, and start date are required" },
                { status: 400 }
            );
        }

        const experience = await createExperience(body);

        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error("Error creating experience:", error);
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

        const body: UpdateExperienceInput = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: "Experience ID is required" },
                { status: 400 }
            );
        }

        const experience = await updateExperience(body);

        return NextResponse.json(experience);
    } catch (error) {
        console.error("Error updating experience:", error);
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
                { error: "Experience ID is required" },
                { status: 400 }
            );
        }

        await deleteExperience(parseInt(id));

        return NextResponse.json({
            message: "Experience deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting experience:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
