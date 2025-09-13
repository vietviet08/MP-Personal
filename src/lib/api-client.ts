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

        const response = await fetch(url, {
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

// API Client wrapper with common methods
export const apiClient = {
    async get(url: string) {
        const response = await fetchWithAuth(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async post(url: string, data: Record<string, unknown>) {
        const response = await fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async put(url: string, data: Record<string, unknown>) {
        const response = await fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async delete(url: string) {
        const response = await fetchWithAuth(url, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
};
