import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import {
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
} from "@/lib/supabase/repositories/skills";
import type { CreateSkillInput, UpdateSkillInput } from "@/lib/supabase/types";

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

        const result = await fetchSkills({
            page,
            limit,
            sort_by,
            sort_order,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching skills:", error);
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

        const body: CreateSkillInput = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { error: "Skill name is required" },
                { status: 400 }
            );
        }

        const skill = await createSkill(body);

        return NextResponse.json(skill, { status: 201 });
    } catch (error) {
        console.error("Error creating skill:", error);
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

        const body: UpdateSkillInput = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: "Skill ID is required" },
                { status: 400 }
            );
        }

        const skill = await updateSkill(body);

        return NextResponse.json(skill);
    } catch (error) {
        console.error("Error updating skill:", error);
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
                { error: "Skill ID is required" },
                { status: 400 }
            );
        }

        await deleteSkill(parseInt(id));

        return NextResponse.json({ message: "Skill deleted successfully" });
    } catch (error) {
        console.error("Error deleting skill:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
