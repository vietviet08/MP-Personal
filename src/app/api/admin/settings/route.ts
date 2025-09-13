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

        // Get settings from database
        const { data: settings, error } = await supabase
            .from("admin_settings")
            .select("*")
            .single();

        if (error && error.code !== "PGRST116") {
            // PGRST116 = no rows returned
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch settings" },
                { status: 500 }
            );
        }

        // Return default settings if none exist
        const defaultSettings = {
            profile: {
                name: user.user_metadata?.full_name || "Admin User",
                email: user.email || "",
                avatar: user.user_metadata?.avatar_url || "",
                bio: "",
                location: "",
                website: "",
            },
            site: {
                title: "My Portfolio",
                description: "A modern portfolio website",
                logo: "",
                favicon: "",
                theme: "auto",
                language: "vi",
            },
            security: {
                twoFactorEnabled: false,
                loginNotifications: true,
                sessionTimeout: 30,
            },
            notifications: {
                emailNotifications: true,
                newMessageAlerts: true,
                systemUpdates: true,
                weeklyReports: false,
            },
            integrations: {
                googleAnalytics: "",
                facebookPixel: "",
                mailchimpApiKey: "",
            },
        };

        return NextResponse.json(settings || defaultSettings);
    } catch (error) {
        console.error("Error fetching settings:", error);
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

        const supabase = getSupabaseAdminClient();
        const body = await request.json();

        // Validate required fields
        if (
            !body.profile ||
            !body.site ||
            !body.security ||
            !body.notifications ||
            !body.integrations
        ) {
            return NextResponse.json(
                { error: "Invalid settings data" },
                { status: 400 }
            );
        }

        // Upsert settings
        const { data, error } = await supabase
            .from("admin_settings")
            .upsert({
                id: 1, // Assuming single settings record
                profile: body.profile,
                site: body.site,
                security: body.security,
                notifications: body.notifications,
                integrations: body.integrations,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to save settings" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
