import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import {
    fetchCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
} from "@/lib/supabase/repositories/certificates";
import type {
    CreateCertificateInput,
    UpdateCertificateInput,
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

        const result = await fetchCertificates({
            page,
            limit,
            sort_by,
            sort_order,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching certificates:", error);
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

        const body: CreateCertificateInput = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { error: "Certificate name is required" },
                { status: 400 }
            );
        }

        const certificate = await createCertificate(body);

        return NextResponse.json(certificate, { status: 201 });
    } catch (error) {
        console.error("Error creating certificate:", error);
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

        const body: UpdateCertificateInput = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: "Certificate ID is required" },
                { status: 400 }
            );
        }

        const certificate = await updateCertificate(body);

        return NextResponse.json(certificate);
    } catch (error) {
        console.error("Error updating certificate:", error);
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
                { error: "Certificate ID is required" },
                { status: 400 }
            );
        }

        await deleteCertificate(parseInt(id));

        return NextResponse.json({
            message: "Certificate deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting certificate:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
