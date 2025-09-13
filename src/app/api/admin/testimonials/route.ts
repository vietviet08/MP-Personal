import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import {
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from "@/lib/supabase/repositories/testimonials";
import type {
    CreateTestimonialInput,
    UpdateTestimonialInput,
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

        const result = await fetchTestimonials({
            page,
            limit,
            sort_by,
            sort_order,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
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

        const body: CreateTestimonialInput = await request.json();

        // Validate required fields
        if (!body.author_name || !body.content) {
            return NextResponse.json(
                { error: "Author name and content are required" },
                { status: 400 }
            );
        }

        const testimonial = await createTestimonial(body);

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error("Error creating testimonial:", error);
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

        const body: UpdateTestimonialInput = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: "Testimonial ID is required" },
                { status: 400 }
            );
        }

        const testimonial = await updateTestimonial(body);

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("Error updating testimonial:", error);
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
                { error: "Testimonial ID is required" },
                { status: 400 }
            );
        }

        await deleteTestimonial(parseInt(id));

        return NextResponse.json({
            message: "Testimonial deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
