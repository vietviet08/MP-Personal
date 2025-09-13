import { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function verifyAdminAuth(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                error: "Missing or invalid authorization header",
                user: null,
            };
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        // Create Supabase client with the token
        const supabase = getSupabaseServerClient();

        // Verify the JWT token
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return { error: "Invalid or expired token", user: null };
        }

        // Check if user has admin role (you can customize this logic)
        // For now, we'll assume any authenticated user is admin
        // You can add role-based checks here if needed

        return { error: null, user };
    } catch (error) {
        console.error("Auth verification error:", error);
        return { error: "Authentication failed", user: null };
    }
}

export async function verifyPublicAuth(request: NextRequest) {
    try {
        // For public APIs, we don't require authentication
        // But we can still verify if a token is provided for analytics purposes
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { error: null, user: null }; // No auth required for public APIs
        }

        const token = authHeader.substring(7);
        const supabase = getSupabaseServerClient();

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return { error: null, user: null }; // Still allow access even if token is invalid
        }

        return { error: null, user };
    } catch {
        return { error: null, user: null }; // Allow access on error for public APIs
    }
}
