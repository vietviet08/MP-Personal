// Database enums
export type MessageStatus = "new" | "read" | "replied" | "archived";
export type PostStatus = "draft" | "published" | "archived";
export type ProjectStatus = "draft" | "published" | "archived";

// Pagination Data
export interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// Legacy Pagination Data (for backward compatibility)
export interface LegacyPaginationData {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

// Base types
export interface BaseEntity {
    id: number;
    created_at: string;
}

export interface BaseEntityWithUpdate extends BaseEntity {
    updated_at: string;
}

// Admin types
export interface Admin {
    id: string; // UUID
    note?: string;
    created_at: string;
}

// Certificate types
export interface Certificate {
    id: number;
    name: string;
    issuer?: string;
    issue_date?: string;
    expires_at?: string;
    credential_id?: string;
    credential_url?: string;
    image_url?: string;
    published: boolean;
    sort_order: number;
    created_at: string;
}

export interface CreateCertificateInput {
    name: string;
    issuer?: string;
    issue_date?: string;
    expires_at?: string;
    credential_id?: string;
    credential_url?: string;
    image_url?: string;
    published?: boolean;
    sort_order?: number;
}

export interface UpdateCertificateInput
    extends Partial<CreateCertificateInput> {
    id: number;
}

// Contact Message types
export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject?: string;
    message: string;
    status: MessageStatus;
    created_at: string;
    read_at?: string;
}

export interface CreateContactMessageInput {
    name: string;
    email: string;
    subject?: string;
    message: string;
}

export interface UpdateContactMessageInput {
    id: number;
    status?: MessageStatus;
    read_at?: string;
}

// Education types
export interface Education {
    id: number;
    school: string;
    degree?: string;
    field?: string;
    start_date?: string;
    end_date?: string;
    logo_url?: string;
    sort_order: number;
    created_at: string;
}

export interface CreateEducationInput {
    school: string;
    degree?: string;
    field?: string;
    start_date?: string;
    end_date?: string;
    logo_url?: string;
    sort_order?: number;
}

export interface UpdateEducationInput extends Partial<CreateEducationInput> {
    id: number;
}

// Experience types
export interface Experience {
    id: number;
    company: string;
    role: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean; // Generated column
    description?: string;
    highlights?: Record<string, unknown>; // JSONB
    logo_url?: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface CreateExperienceInput {
    company: string;
    role: string;
    location?: string;
    start_date: string;
    end_date?: string;
    description?: string;
    highlights?: Record<string, unknown>;
    logo_url?: string;
    sort_order?: number;
}

export interface UpdateExperienceInput extends Partial<CreateExperienceInput> {
    id: number;
}

// Newsletter Subscriber types
export interface NewsletterSubscriber {
    id: number;
    email: string;
    verified: boolean;
    created_at: string;
}

export interface CreateNewsletterSubscriberInput {
    email: string;
    verified?: boolean;
}

// Post types
export interface Post {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    cover_image_url?: string;
    status: PostStatus;
    reading_time_minutes?: number;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePostInput {
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    cover_image_url?: string;
    status?: PostStatus;
    reading_time_minutes?: number;
    published_at?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
    id: number;
}

// Post Tag types
export interface PostTag {
    post_id: number;
    tag_id: number;
}

// Profile types
export interface Profile {
    id: string; // UUID
    full_name: string;
    headline?: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
    email_public?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateProfileInput {
    id: string;
    full_name: string;
    headline?: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
    email_public?: string;
}

export interface UpdateProfileInput extends Partial<CreateProfileInput> {
    id: string;
}

// Project types
export interface Project {
    id: number;
    slug: string;
    title: string;
    short_description?: string;
    content?: string;
    repo_url?: string;
    live_url?: string;
    cover_image_url?: string;
    featured: boolean;
    status: ProjectStatus;
    start_date?: string;
    end_date?: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectInput {
    slug: string;
    title: string;
    short_description?: string;
    content?: string;
    repo_url?: string;
    live_url?: string;
    cover_image_url?: string;
    featured?: boolean;
    status?: ProjectStatus;
    start_date?: string;
    end_date?: string;
    order_index?: number;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
    id: number;
}

// Project Image types
export interface ProjectImage {
    id: number;
    project_id: number;
    image_url: string;
    alt?: string;
    sort_order: number;
}

export interface CreateProjectImageInput {
    project_id: number;
    image_url: string;
    alt?: string;
    sort_order?: number;
}

export interface UpdateProjectImageInput
    extends Partial<CreateProjectImageInput> {
    id: number;
}

// Project Skill types
export interface ProjectSkill {
    project_id: number;
    skill_id: number;
}

// Project Tag types
export interface ProjectTag {
    project_id: number;
    tag_id: number;
}

// Site Settings types
export interface SiteSetting {
    key: string;
    value: Record<string, unknown>; // JSONB
    is_public: boolean;
    updated_at: string;
}

export interface CreateSiteSettingInput {
    key: string;
    value: Record<string, unknown>;
    is_public?: boolean;
}

export interface UpdateSiteSettingInput {
    key: string;
    value?: Record<string, unknown>;
    is_public?: boolean;
}

// Skill types
export interface Skill {
    id: number;
    name: string;
    category?: string;
    level?: number;
    icon_url?: string;
    created_at: string;
}

export interface CreateSkillInput {
    name: string;
    category?: string;
    level?: number;
    icon_url?: string;
}

export interface UpdateSkillInput extends Partial<CreateSkillInput> {
    id: number;
}

// Social Link types
export interface SocialLink {
    id: number;
    profile_id: string; // UUID
    label: string;
    url: string;
    sort_order: number;
}

export interface CreateSocialLinkInput {
    profile_id: string;
    label: string;
    url: string;
    sort_order?: number;
}

export interface UpdateSocialLinkInput extends Partial<CreateSocialLinkInput> {
    id: number;
}

// Tag types
export interface Tag {
    id: number;
    slug: string;
    name: string;
    created_at: string;
}

export interface CreateTagInput {
    slug: string;
    name: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
    id: number;
}

// Testimonial types
export interface Testimonial {
    id: number;
    author_name: string;
    author_role?: string;
    company?: string;
    avatar_url?: string;
    content: string;
    published: boolean;
    sort_order: number;
    created_at: string;
}

export interface CreateTestimonialInput {
    author_name: string;
    author_role?: string;
    company?: string;
    avatar_url?: string;
    content: string;
    published?: boolean;
    sort_order?: number;
}

export interface UpdateTestimonialInput
    extends Partial<CreateTestimonialInput> {
    id: number;
}

// Extended types with relationships
export interface PostWithTags extends Post {
    tags: Tag[];
}

export interface ProjectWithDetails extends Project {
    images: ProjectImage[];
    skills: Skill[];
    tags: Tag[];
}

export interface ProfileWithSocialLinks extends Profile {
    social_links: SocialLink[];
}

// Pagination types
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

// Filter types
export interface PostFilters extends PaginationParams {
    status?: PostStatus;
    search?: string;
}

export interface ProjectFilters extends PaginationParams {
    status?: ProjectStatus;
    featured?: boolean;
    search?: string;
}

export interface ContactMessageFilters extends PaginationParams {
    status?: MessageStatus;
    search?: string;
}

// Analytics types
export interface AnalyticsData {
    overview: {
        totalVisitors: number;
        totalPageViews: number;
        totalMessages: number;
        totalProjects: number;
        totalPosts: number;
        bounceRate: number;
        avgSessionDuration: string;
    };
    recentActivity: Array<{
        id: number;
        type: "visit" | "message" | "project_view" | "post_view";
        description: string;
        timestamp: string;
        metadata?: unknown;
    }>;
    topPages: Array<{
        page: string;
        views: number;
        uniqueVisitors: number;
    }>;
    monthlyStats: Array<{
        month: string;
        visitors: number;
        pageViews: number;
        messages: number;
    }>;
}
