import { getSupabaseServerClient } from "../server-client";
import { getSupabaseBrowserClient } from "../browser-client";
import type {
    ContactMessage,
    CreateContactMessageInput,
    UpdateContactMessageInput,
    PaginatedResponse,
    ContactMessageFilters,
} from "../types";

export async function fetchContactMessages(
    params: ContactMessageFilters = {}
): Promise<PaginatedResponse<ContactMessage>> {
    const supabase = getSupabaseServerClient();
    const {
        page = 1,
        limit = 10,
        sort_by = "created_at",
        sort_order = "desc",
        status,
        search,
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("contact_messages")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (status) {
        query = query.eq("status", status);
    }

    if (search) {
        query = query.or(
            `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`
        );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        data: (data ?? []) as ContactMessage[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchContactMessageById(
    id: number
): Promise<ContactMessage | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as ContactMessage | null;
}

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

export async function updateContactMessage(
    input: UpdateContactMessageInput
): Promise<ContactMessage> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("contact_messages")
        .update({
            status: input.status,
            read_at: input.read_at,
        })
        .eq("id", input.id)
        .select()
        .single();

    if (error) throw error;
    return data as ContactMessage;
}

export async function deleteContactMessage(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

    if (error) throw error;
}
