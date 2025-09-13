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
        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range") || "30d";

        // Calculate date range
        const now = new Date();
        const startDate = new Date();

        switch (range) {
            case "7d":
                startDate.setDate(now.getDate() - 7);
                break;
            case "30d":
                startDate.setDate(now.getDate() - 30);
                break;
            case "90d":
                startDate.setDate(now.getDate() - 90);
                break;
            case "1y":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }

        // Get overview statistics
        const [
            { count: totalVisitors },
            { count: totalPageViews },
            { count: totalMessages },
            { count: totalProjects },
            { count: totalPosts },
        ] = await Promise.all([
            supabase
                .from("analytics_visitors")
                .select("*", { count: "exact", head: true }),
            supabase
                .from("analytics_page_views")
                .select("*", { count: "exact", head: true }),
            supabase
                .from("contact_messages")
                .select("*", { count: "exact", head: true }),
            supabase
                .from("projects")
                .select("*", { count: "exact", head: true }),
            supabase.from("posts").select("*", { count: "exact", head: true }),
        ]);

        // Get recent activity
        const { data: recentActivity } = await supabase
            .from("analytics_activity")
            .select("*")
            .gte("created_at", startDate.toISOString())
            .order("created_at", { ascending: false })
            .limit(10);

        // Get top pages
        const { data: topPages } = await supabase
            .from("analytics_page_views")
            .select("page, views, unique_visitors")
            .gte("created_at", startDate.toISOString())
            .order("views", { ascending: false })
            .limit(10);

        // Get monthly stats
        const { data: monthlyStats } = await supabase
            .from("analytics_monthly")
            .select("*")
            .gte("month", startDate.toISOString())
            .order("month", { ascending: true });

        const analyticsData = {
            overview: {
                totalVisitors: totalVisitors || 0,
                totalPageViews: totalPageViews || 0,
                totalMessages: totalMessages || 0,
                totalProjects: totalProjects || 0,
                totalPosts: totalPosts || 0,
                bounceRate: 45.2, // Mock data - you can calculate this from your analytics
                avgSessionDuration: "2:34", // Mock data
            },
            recentActivity: recentActivity || [],
            topPages: topPages || [],
            monthlyStats: monthlyStats || [],
        };

        return NextResponse.json(analyticsData);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
