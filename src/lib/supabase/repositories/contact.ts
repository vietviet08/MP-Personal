import { getSupabaseServerClient } from "../server-client";
import { getSupabaseBrowserClient } from "../browser-client";

export type CreateContactMessageInput = {
    name: string;
    email: string;
    subject?: string;
    message: string;
};

export async function createContactMessage(input: CreateContactMessageInput) {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("contact_messages").insert({
        name: input.name,
        email: input.email,
        subject: input.subject ?? null,
        message: input.message,
    });

    if (error) throw error;
}

// Alternative function for client-side usage with RLS
export async function createContactMessageAnonymous(
    input: CreateContactMessageInput
) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("contact_messages").insert({
        name: input.name,
        email: input.email,
        subject: input.subject ?? null,
        message: input.message,
    });

    if (error) throw error;
}
