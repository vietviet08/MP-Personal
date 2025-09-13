import { getSupabaseServerClient } from "../server-client";
import type {
    NewsletterSubscriber,
    CreateNewsletterSubscriberInput,
    PaginatedResponse,
    PaginationParams,
} from "../types";

export async function fetchNewsletterSubscribers(
    params: PaginationParams = {}
): Promise<PaginatedResponse<NewsletterSubscriber>> {
    const supabase = getSupabaseServerClient();
    const {
        page = 1,
        limit = 10,
        sort_by = "created_at",
        sort_order = "desc",
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact" })
        .order(sort_by, { ascending: sort_order === "asc" })
        .range(from, to);

    if (error) throw error;

    return {
        data: (data ?? []) as NewsletterSubscriber[],
        pagination: {
            page,
            limit,
            total: count ?? 0,
            total_pages: Math.ceil((count ?? 0) / limit),
        },
    };
}

export async function fetchAllNewsletterSubscribers(): Promise<
    NewsletterSubscriber[]
> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as NewsletterSubscriber[];
}

export async function fetchNewsletterSubscriberById(
    id: number
): Promise<NewsletterSubscriber | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data as NewsletterSubscriber | null;
}

export async function fetchNewsletterSubscriberByEmail(
    email: string
): Promise<NewsletterSubscriber | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) throw error;
    return data as NewsletterSubscriber | null;
}

export async function createNewsletterSubscriber(
    input: CreateNewsletterSubscriberInput
): Promise<NewsletterSubscriber> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("newsletter_subscribers")
        .insert({
            email: input.email,
            verified: input.verified ?? false,
        })
        .select()
        .single();

    if (error) throw error;
    return data as NewsletterSubscriber;
}

export async function updateNewsletterSubscriber(
    id: number,
    verified: boolean
): Promise<NewsletterSubscriber> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
        .from("newsletter_subscribers")
        .update({ verified })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as NewsletterSubscriber;
}

export async function deleteNewsletterSubscriber(id: number): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

    if (error) throw error;
}
