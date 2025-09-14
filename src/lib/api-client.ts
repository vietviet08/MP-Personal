import { getSupabaseBrowserClient } from "@/lib/supabase";

export async function getAuthHeaders() {
    const supabase = getSupabaseBrowserClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error("No authentication token available");
    }

    return {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
    };
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    try {
        const headers = await getAuthHeaders();

        // Ensure URL is absolute for client-side requests
        const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";
        const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (response.status === 401) {
            // Token expired or invalid, redirect to login
            window.location.href = "/admin/login";
            throw new Error("Authentication required");
        }

        return response;
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "No authentication token available"
        ) {
            window.location.href = "/admin/login";
        }
        throw error;
    }
}

// Helper function to safely parse JSON response
async function parseJsonResponse(response: Response) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        // If parsing fails, likely got HTML error page
        console.error("Failed to parse JSON response:", text.substring(0, 200));
        throw new Error(
            `Server returned non-JSON response: ${response.status} ${response.statusText}`
        );
    }
}

// API Client wrapper with common methods
export const apiClient = {
    async get(url: string) {
        const response = await fetchWithAuth(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`GET ${url} failed:`, errorText.substring(0, 200));
            throw new Error(
                `HTTP error! status: ${response.status} - ${response.statusText}`
            );
        }
        return parseJsonResponse(response);
    },

    async post(url: string, data: Record<string, unknown>) {
        const response = await fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`POST ${url} failed:`, errorText.substring(0, 200));
            throw new Error(
                `HTTP error! status: ${response.status} - ${response.statusText}`
            );
        }
        return parseJsonResponse(response);
    },

    async put(url: string, data: Record<string, unknown>) {
        const response = await fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`PUT ${url} failed:`, errorText.substring(0, 200));
            throw new Error(
                `HTTP error! status: ${response.status} - ${response.statusText}`
            );
        }
        return parseJsonResponse(response);
    },

    async delete(url: string) {
        const response = await fetchWithAuth(url, {
            method: "DELETE",
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DELETE ${url} failed:`, errorText.substring(0, 200));
            throw new Error(
                `HTTP error! status: ${response.status} - ${response.statusText}`
            );
        }
        return parseJsonResponse(response);
    },
};
