import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
    try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from("contact_messages")
            .select("id, name, email, subject, message, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: "Failed to fetch messages" },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
