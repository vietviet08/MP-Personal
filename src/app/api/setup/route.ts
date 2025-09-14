import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { verifyAdminAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
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

        // Create enum types first
        const enumTypes = [
            {
                name: "message_status",
                sql: `CREATE TYPE message_status AS ENUM ('new', 'read', 'replied', 'archived');`,
            },
            {
                name: "post_status",
                sql: `CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');`,
            },
            {
                name: "project_status",
                sql: `CREATE TYPE project_status AS ENUM ('draft', 'published', 'archived');`,
            },
        ];

        // Create enum types
        for (const enumType of enumTypes) {
            try {
                await supabase.rpc("exec_sql", { sql: enumType.sql });
            } catch {}
        }

        // Create tables if they don't exist
        const tables = [
            {
                name: "admins",
                sql: `
                    CREATE TABLE IF NOT EXISTS admins (
                        id UUID NOT NULL,
                        note TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT admins_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "certificates",
                sql: `
                    CREATE TABLE IF NOT EXISTS certificates (
                        id BIGSERIAL NOT NULL,
                        name TEXT NOT NULL,
                        issuer TEXT,
                        issue_date DATE,
                        expires_at DATE,
                        credential_id TEXT,
                        credential_url TEXT,
                        image_url TEXT,
                        published BOOLEAN DEFAULT TRUE,
                        sort_order INTEGER DEFAULT 0,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT certificates_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "contact_messages",
                sql: `
                    CREATE TABLE IF NOT EXISTS contact_messages (
                        id BIGSERIAL NOT NULL,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL,
                        subject TEXT,
                        message TEXT NOT NULL,
                        status message_status NOT NULL DEFAULT 'new'::message_status,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        read_at TIMESTAMP WITH TIME ZONE,
                        CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "educations",
                sql: `
                    CREATE TABLE IF NOT EXISTS educations (
                        id BIGSERIAL NOT NULL,
                        school TEXT NOT NULL,
                        degree TEXT,
                        field TEXT,
                        start_date DATE,
                        end_date DATE,
                        logo_url TEXT,
                        sort_order INTEGER DEFAULT 0,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT educations_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "experiences",
                sql: `
                    CREATE TABLE IF NOT EXISTS experiences (
                        id BIGSERIAL NOT NULL,
                        company TEXT NOT NULL,
                        role TEXT NOT NULL,
                        location TEXT,
                        start_date DATE NOT NULL,
                        end_date DATE,
                        current BOOLEAN GENERATED ALWAYS AS ((end_date IS NULL)) STORED,
                        description TEXT,
                        highlights JSONB,
                        logo_url TEXT,
                        sort_order INTEGER DEFAULT 0,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT experiences_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "newsletter_subscribers",
                sql: `
                    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                        id BIGSERIAL NOT NULL,
                        email TEXT NOT NULL,
                        verified BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id),
                        CONSTRAINT newsletter_subscribers_email_key UNIQUE (email)
                    );
                `,
            },
            {
                name: "posts",
                sql: `
                    CREATE TABLE IF NOT EXISTS posts (
                        id BIGSERIAL NOT NULL,
                        slug TEXT NOT NULL,
                        title TEXT NOT NULL,
                        excerpt TEXT,
                        content TEXT,
                        cover_image_url TEXT,
                        status post_status NOT NULL DEFAULT 'draft'::post_status,
                        reading_time_minutes INTEGER,
                        published_at TIMESTAMP WITH TIME ZONE,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT posts_pkey PRIMARY KEY (id),
                        CONSTRAINT posts_slug_key UNIQUE (slug)
                    );
                `,
            },
            {
                name: "post_tags",
                sql: `
                    CREATE TABLE IF NOT EXISTS post_tags (
                        post_id BIGINT NOT NULL,
                        tag_id BIGINT NOT NULL,
                        CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id)
                    );
                `,
            },
            {
                name: "profiles",
                sql: `
                    CREATE TABLE IF NOT EXISTS profiles (
                        id UUID NOT NULL,
                        full_name TEXT NOT NULL,
                        headline TEXT,
                        bio TEXT,
                        avatar_url TEXT,
                        location TEXT,
                        email_public TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT profiles_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "projects",
                sql: `
                    CREATE TABLE IF NOT EXISTS projects (
                        id BIGSERIAL NOT NULL,
                        slug TEXT NOT NULL,
                        title TEXT NOT NULL,
                        short_description TEXT,
                        content TEXT,
                        repo_url TEXT,
                        live_url TEXT,
                        cover_image_url TEXT,
                        featured BOOLEAN DEFAULT FALSE,
                        status project_status NOT NULL DEFAULT 'draft'::project_status,
                        start_date DATE,
                        end_date DATE,
                        order_index INTEGER DEFAULT 0,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT projects_pkey PRIMARY KEY (id),
                        CONSTRAINT projects_slug_key UNIQUE (slug)
                    );
                `,
            },
            {
                name: "project_images",
                sql: `
                    CREATE TABLE IF NOT EXISTS project_images (
                        id BIGSERIAL NOT NULL,
                        project_id BIGINT NOT NULL,
                        image_url TEXT NOT NULL,
                        alt TEXT,
                        sort_order INTEGER DEFAULT 0,
                        CONSTRAINT project_images_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "project_skills",
                sql: `
                    CREATE TABLE IF NOT EXISTS project_skills (
                        project_id BIGINT NOT NULL,
                        skill_id BIGINT NOT NULL,
                        CONSTRAINT project_skills_pkey PRIMARY KEY (project_id, skill_id)
                    );
                `,
            },
            {
                name: "project_tags",
                sql: `
                    CREATE TABLE IF NOT EXISTS project_tags (
                        project_id BIGINT NOT NULL,
                        tag_id BIGINT NOT NULL,
                        CONSTRAINT project_tags_pkey PRIMARY KEY (project_id, tag_id)
                    );
                `,
            },
            {
                name: "site_settings",
                sql: `
                    CREATE TABLE IF NOT EXISTS site_settings (
                        key TEXT NOT NULL,
                        value JSONB NOT NULL,
                        is_public BOOLEAN DEFAULT TRUE,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT site_settings_pkey PRIMARY KEY (key)
                    );
                `,
            },
            {
                name: "skills",
                sql: `
                    CREATE TABLE IF NOT EXISTS skills (
                        id BIGSERIAL NOT NULL,
                        name TEXT NOT NULL,
                        category TEXT,
                        level INTEGER,
                        icon_url TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT skills_pkey PRIMARY KEY (id),
                        CONSTRAINT skills_name_key UNIQUE (name)
                    );
                `,
            },
            {
                name: "social_links",
                sql: `
                    CREATE TABLE IF NOT EXISTS social_links (
                        id BIGSERIAL NOT NULL,
                        profile_id UUID NOT NULL,
                        label TEXT NOT NULL,
                        url TEXT NOT NULL,
                        sort_order INTEGER DEFAULT 0,
                        CONSTRAINT social_links_pkey PRIMARY KEY (id),
                        CONSTRAINT social_links_profile_id_label_key UNIQUE (profile_id, label)
                    );
                `,
            },
            {
                name: "tags",
                sql: `
                    CREATE TABLE IF NOT EXISTS tags (
                        id BIGSERIAL NOT NULL,
                        slug TEXT NOT NULL,
                        name TEXT NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT tags_pkey PRIMARY KEY (id),
                        CONSTRAINT tags_slug_key UNIQUE (slug)
                    );
                `,
            },
            {
                name: "testimonials",
                sql: `
                    CREATE TABLE IF NOT EXISTS testimonials (
                        id BIGSERIAL NOT NULL,
                        author_name TEXT NOT NULL,
                        author_role TEXT,
                        company TEXT,
                        avatar_url TEXT,
                        content TEXT NOT NULL,
                        published BOOLEAN DEFAULT TRUE,
                        sort_order INTEGER DEFAULT 0,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        CONSTRAINT testimonials_pkey PRIMARY KEY (id)
                    );
                `,
            },
            {
                name: "admin_settings",
                sql: `
                    CREATE TABLE IF NOT EXISTS admin_settings (
                        id INTEGER PRIMARY KEY DEFAULT 1,
                        profile JSONB,
                        site JSONB,
                        security JSONB,
                        notifications JSONB,
                        integrations JSONB,
                        updated_at TIMESTAMP DEFAULT NOW()
                    );
                `,
            },
            {
                name: "analytics_visitors",
                sql: `
                    CREATE TABLE IF NOT EXISTS analytics_visitors (
                        id SERIAL PRIMARY KEY,
                        visitor_id VARCHAR(255),
                        created_at TIMESTAMP DEFAULT NOW()
                    );
                `,
            },
            {
                name: "analytics_page_views",
                sql: `
                    CREATE TABLE IF NOT EXISTS analytics_page_views (
                        id SERIAL PRIMARY KEY,
                        page VARCHAR(255),
                        views INTEGER DEFAULT 1,
                        unique_visitors INTEGER DEFAULT 1,
                        created_at TIMESTAMP DEFAULT NOW()
                    );
                `,
            },
            {
                name: "analytics_activity",
                sql: `
                    CREATE TABLE IF NOT EXISTS analytics_activity (
                        id SERIAL PRIMARY KEY,
                        type VARCHAR(50),
                        description TEXT,
                        metadata JSONB,
                        created_at TIMESTAMP DEFAULT NOW()
                    );
                `,
            },
            {
                name: "analytics_monthly",
                sql: `
                    CREATE TABLE IF NOT EXISTS analytics_monthly (
                        id SERIAL PRIMARY KEY,
                        month DATE,
                        visitors INTEGER DEFAULT 0,
                        page_views INTEGER DEFAULT 0,
                        messages INTEGER DEFAULT 0
                    );
                `,
            },
        ];

        // Foreign key constraints
        const foreignKeys = [
            {
                name: "post_tags_post_id_fkey",
                sql: `ALTER TABLE post_tags ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
            {
                name: "post_tags_tag_id_fkey",
                sql: `ALTER TABLE post_tags ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
            {
                name: "project_images_project_id_fkey",
                sql: `ALTER TABLE project_images ADD CONSTRAINT project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
            {
                name: "project_skills_project_id_fkey",
                sql: `ALTER TABLE project_skills ADD CONSTRAINT project_skills_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
            {
                name: "project_skills_skill_id_fkey",
                sql: `ALTER TABLE project_skills ADD CONSTRAINT project_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES skills (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
            {
                name: "project_tags_project_id_fkey",
                sql: `ALTER TABLE project_tags ADD CONSTRAINT project_tags_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
            {
                name: "project_tags_tag_id_fkey",
                sql: `ALTER TABLE project_tags ADD CONSTRAINT project_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
            {
                name: "social_links_profile_id_fkey",
                sql: `ALTER TABLE social_links ADD CONSTRAINT social_links_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;`,
            },
        ];

        const results = [];

        // Since we can't execute raw SQL directly, we'll just check if tables exist
        // and provide instructions for manual setup
        for (const table of tables) {
            try {
                // Try to select from the table to check if it exists
                const { error } = await supabase
                    .from(table.name)
                    .select("*")
                    .limit(1);
                if (error) {
                    if (
                        error.code === "42P01" ||
                        error.message?.includes("relation") ||
                        error.message?.includes("does not exist")
                    ) {
                        results.push({
                            table: table.name,
                            status: "not_exists",
                            message: `Table ${table.name} does not exist. Please create it manually.`,
                            sql: table.sql,
                        });
                    } else {
                        results.push({
                            table: table.name,
                            status: "error",
                            error: error.message,
                        });
                    }
                } else {
                    results.push({ table: table.name, status: "exists" });
                }
            } catch (err) {
                console.error(`Exception checking table ${table.name}:`, err);
                results.push({
                    table: table.name,
                    status: "error",
                    error: err instanceof Error ? err.message : "Unknown error",
                });
            }
        }

        // Insert some sample data
        try {
            // Sample posts
            const { error: postsError } = await supabase.from("posts").upsert(
                [
                    {
                        id: 1,
                        title: "Chào mừng đến với blog của tôi",
                        content:
                            "Đây là bài viết đầu tiên trên blog của tôi. Tôi sẽ chia sẻ những kinh nghiệm và kiến thức về lập trình, công nghệ và cuộc sống.",
                        excerpt:
                            "Bài viết đầu tiên giới thiệu về blog và những gì bạn có thể mong đợi.",
                        slug: "chao-mung-den-voi-blog-cua-toi",
                        status: "published",
                        author: "Admin",
                        published_at: new Date().toISOString(),
                        tags: ["giới thiệu", "blog", "lập trình"],
                    },
                ],
                { onConflict: "id" }
            );

            if (postsError) {
                console.error("Error inserting sample posts:", postsError);
            }

            // Sample projects
            const { error: projectsError } = await supabase
                .from("projects")
                .upsert(
                    [
                        {
                            id: 1,
                            title: "Portfolio Website",
                            description:
                                "Một website portfolio hiện đại được xây dựng với Next.js, TypeScript và Tailwind CSS. Website này showcase các dự án, kỹ năng và kinh nghiệm của tôi.",
                            short_description:
                                "Website portfolio hiện đại với Next.js",
                            image_url: "/pic-project-1.png",
                            live_url: "https://your-portfolio.com",
                            github_url:
                                "https://github.com/your-username/portfolio",
                            status: "completed",
                            priority: "high",
                            technologies: [
                                "Next.js",
                                "TypeScript",
                                "Tailwind CSS",
                                "Supabase",
                            ],
                            featured: true,
                            order_index: 1,
                        },
                        {
                            id: 2,
                            title: "E-commerce Platform",
                            description:
                                "Nền tảng thương mại điện tử đầy đủ tính năng với giỏ hàng, thanh toán, quản lý đơn hàng và dashboard admin.",
                            short_description:
                                "Nền tảng thương mại điện tử đầy đủ tính năng",
                            image_url: "/pic-project-2.png",
                            live_url: "https://your-ecommerce.com",
                            github_url:
                                "https://github.com/your-username/ecommerce",
                            status: "active",
                            priority: "medium",
                            technologies: [
                                "React",
                                "Node.js",
                                "MongoDB",
                                "Stripe",
                            ],
                            featured: true,
                            order_index: 2,
                        },
                    ],
                    { onConflict: "id" }
                );

            if (projectsError) {
                console.error(
                    "Error inserting sample projects:",
                    projectsError
                );
            }
        } catch (err) {
            console.error("Error inserting sample data:", err);
        }

        // Generate complete SQL setup script
        const allSqlCommands = [
            // Enum types
            ...enumTypes.map((et) => et.sql),
            "",
            // Tables
            ...tables.map((t) => t.sql),
            "",
            // Foreign keys
            ...foreignKeys.map((fk) => fk.sql),
        ].join("\n");

        return NextResponse.json({
            success: true,
            message: "Database setup analysis completed",
            results,
            setupInstructions: {
                title: "Complete Database Setup",
                description:
                    "Please run the following SQL commands in your Supabase SQL Editor to set up all tables, enums, and relationships:",
                steps: [
                    "1. Go to your Supabase Dashboard",
                    "2. Navigate to SQL Editor",
                    "3. Copy and paste the complete SQL script below",
                    "4. Execute the script",
                    "5. Verify all tables are created successfully",
                ],
                sqlCommands: allSqlCommands,
                tablesCreated: tables.length,
                enumsCreated: enumTypes.length,
                foreignKeysCreated: foreignKeys.length,
            },
        });
    } catch (error) {
        console.error("Setup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
