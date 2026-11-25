import { supabase, isSupabaseConfigured } from "../lib/supabase";

function requireSupabase() {
    if (!isSupabaseConfigured || !supabase) {
        throw new Error(
            "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.",
        );
    }
    return supabase;
}

export function slugify(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function fetchAllPortfolioData() {
    const client = requireSupabase();

    const [
        profileRes,
        projectsRes,
        experiencesRes,
        educationRes,
        skillsRes,
        interestsRes,
        coursesRes,
        certificatesRes,
        languagesRes,
    ] = await Promise.all([
        client.from("profile").select("*").eq("id", 1).maybeSingle(),
        client
            .from("projects")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        client
            .from("experiences")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        client
            .from("education")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        client
            .from("skills")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        client
            .from("interests")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        client
            .from("courses")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        client
            .from("certificates")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        client
            .from("languages")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
    ]);

    const errors = [
        profileRes.error,
        projectsRes.error,
        experiencesRes.error,
        educationRes.error,
        skillsRes.error,
        interestsRes.error,
        coursesRes.error,
        certificatesRes.error,
        languagesRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
        throw new Error(errors[0].message);
    }

    const profile = profileRes.data;
    if (!profile) {
        throw new Error("Profile row not found in database. Run seed SQL.");
    }

    return {
        name: profile.name,
        title: profile.title,
        tagline: profile.tagline,
        email: profile.email,
        location: profile.location,
        bio: profile.bio,
        avatarUrl: profile.avatar_url || null,
        acceptingProjects: profile.accepting_projects ?? true,
        birthday: {
            date: profile.birthday_date,
            age: profile.birthday_age,
        },
        social: {
            github: profile.social_github || "",
            facebook: profile.social_facebook || "",
            linkedin: profile.social_linkedin || "",
            instagram: profile.social_instagram || "",
        },
        projects: (projectsRes.data || []).map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || slugify(p.title),
            description: p.description,
            longDescription: p.long_description || "",
            image: p.images || [],
            tags: p.tags || [],
            github: p.github || "#",
            live: p.live || "#",
            featured: Boolean(p.featured),
            year: p.year,
            category: p.category,
            sort_order: p.sort_order ?? 0,
        })),
        experience: (experiencesRes.data || []).map((e) => ({
            id: e.id,
            role: e.role,
            company: e.company,
            period: e.period,
            desc: e.description,
            sort_order: e.sort_order ?? 0,
        })),
        education: (educationRes.data || []).map((ed) => ({
            id: ed.id,
            degree: ed.degree,
            tag: ed.tag,
            year: ed.year,
            institution: ed.institution,
            grade: ed.grade,
            gradeNote: ed.grade_note,
            icon: ed.icon || "🎓",
            accent: ed.accent || "#FF6B2B",
            sort_order: ed.sort_order ?? 0,
        })),
        skills: (skillsRes.data || []).map((s) => s.name),
        skillRows: skillsRes.data || [],
        interests: (interestsRes.data || []).map((it) => ({
            id: it.id,
            icon: it.icon,
            label: it.label,
            desc: it.description,
            sort_order: it.sort_order ?? 0,
        })),
        courses: (coursesRes.data || []).map((c) => ({
            id: c.id,
            name: c.name,
            platform: c.platform,
            year: c.year,
            sort_order: c.sort_order ?? 0,
        })),
        certificates: (certificatesRes.data || []).map((cert) => ({
            id: cert.id,
            title: cert.title,
            issuer: cert.issuer,
            issueDate: cert.issue_date,
            credentialUrl: cert.credential_url || "",
            imageUrl: cert.image_url || "",
            sort_order: cert.sort_order ?? 0,
        })),
        languages: (languagesRes.data || []).map((l) => ({
            id: l.id,
            name: l.name,
            level: l.level,
            proficiency: l.proficiency,
            sort_order: l.sort_order ?? 0,
        })),
    };
}

export async function submitContactMessage({
    name,
    email,
    projectType,
    message,
}) {
    const client = requireSupabase();
    const { error } = await client.from("contact_messages").insert([
        {
            name,
            email,
            project_type: projectType || "Not specified",
            message,
        },
    ]);
    if (error) throw error;
}

export async function uploadPortfolioAsset(file, folder = "uploads") {
    const client = requireSupabase();
    const ext = file.name.split(".").pop() || "png";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${folder}/${safeName}`;

    const { error: uploadError } = await client.storage
        .from("portfolio-assets")
        .upload(path, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = client.storage.from("portfolio-assets").getPublicUrl(path);
    return data.publicUrl;
}

// ─── Admin CRUD Helpers ─────────────────────────────────────

export async function updateProfile(payload) {
    const client = requireSupabase();
    const { error } = await client
        .from("profile")
        .upsert({ id: 1, ...payload, updated_at: new Date().toISOString() });
    if (error) throw error;
}

export async function upsertRow(table, row) {
    const client = requireSupabase();
    const { id, ...rest } = row;
    if (id) {
        const { data, error } = await client
            .from(table)
            .update(rest)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await client
            .from(table)
            .insert([rest])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

export async function deleteRow(table, id) {
    const client = requireSupabase();
    const { error } = await client.from(table).delete().eq("id", id);
    if (error) throw error;
}

export async function fetchContactMessages() {
    const client = requireSupabase();
    const { data, error } = await client
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function markMessageRead(id, isRead) {
    const client = requireSupabase();
    const { error } = await client
        .from("contact_messages")
        .update({ is_read: isRead })
        .eq("id", id);
    if (error) throw error;
}
