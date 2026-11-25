import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { usePortfolio } from "../context/PortfolioContext";
import {
    updateProfile,
    upsertRow,
    deleteRow,
    uploadPortfolioAsset,
    fetchContactMessages,
    markMessageRead,
    slugify,
} from "../services/portfolioService";
import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import Toast from "../components/Toast";
import {
    LogOut,
    Plus,
    Trash2,
    Edit3,
    Save,
    Upload,
    RefreshCw,
    Mail,
    CheckCircle2,
    Circle,
    Database,
    Lock,
} from "lucide-react";

const TABS = [
    { id: "profile", label: "Profile & About" },
    { id: "projects", label: "Projects" },
    { id: "experiences", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "interests", label: "Interests" },
    { id: "courses", label: "Training & Courses" },
    { id: "certificates", label: "Certificates" },
    { id: "languages", label: "Languages" },
    { id: "messages", label: "Messages" },
];

const inputCls =
    "w-full rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-[#f0ece4] placeholder-[#8a857d]/60 focus:border-[#ff6b00] focus:outline-none transition";
const labelCls = "block text-xs font-mono uppercase tracking-wider text-[#8a857d] mb-1.5";
const btnPrimary =
    "inline-flex items-center gap-2 rounded-xl bg-[#ff6b00] px-4 py-2 text-sm font-semibold text-black hover:bg-[#ff8c3a] transition cursor-pointer disabled:opacity-50";
const btnGhost =
    "inline-flex items-center gap-2 rounded-xl border border-[#1f1f1f] bg-[#141414] px-3.5 py-2 text-sm text-[#f0ece4] hover:border-[#ff6b00]/60 transition cursor-pointer disabled:opacity-50";

export default function AdminPage() {
    const { portfolio, isUsingDatabase, refresh } = usePortfolio();
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signingIn, setSigningIn] = useState(false);

    const [activeTab, setActiveTab] = useState("profile");
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);

    const notify = useCallback(
        (message, type = "success") => setToast({ message, type }),
        [],
    );

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            return;
        }
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session ?? null);
            setAuthLoading(false);
        });
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setSigningIn(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            notify(error.message, "error");
        } else {
            notify("Signed in to Admin Panel", "success");
        }
        setSigningIn(false);
    };

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        notify("Signed out", "success");
    };

    if (!isSupabaseConfigured) {
        return (
            <div className="w-full flex-1 flex flex-col gap-5 page-transition-enter">
                <div className="flex items-center justify-between">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back Home
                    </Link>
                </div>
                <BentoCard delay={0}>
                    <div className="flex items-center gap-2 text-[#ff6b00] font-mono text-xs uppercase tracking-wider mb-2">
                        <Database className="w-4 h-4" />
                        Supabase Setup Required
                    </div>
                    <h1 className="text-2xl font-bold text-[#f0ece4] mb-3">
                        Connect Your Supabase Project
                    </h1>
                    <p className="text-sm text-[#8a857d] leading-relaxed mb-4">
                        Your portfolio is currently running on the static fallback
                        in <code>src/data/portfolio.js</code>. To enable the live
                        database and Admin Panel:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-[#f0ece4]/90 mb-6">
                        <li>
                            Open your Supabase Dashboard →{" "}
                            <strong>SQL Editor</strong> and run{" "}
                            <code>supabase/migrations/001_initial_schema.sql</code>{" "}
                            followed by{" "}
                            <code>supabase/migrations/002_seed_data.sql</code>.
                        </li>
                        <li>
                            In Supabase Dashboard →{" "}
                            <strong>Authentication → Users</strong>, create your
                            admin user (email & password).
                        </li>
                        <li>
                            Create a <code>.env</code> file in the project root
                            (copied from <code>.env.example</code>) with{" "}
                            <code>VITE_SUPABASE_URL</code> and{" "}
                            <code>VITE_SUPABASE_ANON_KEY</code>.
                        </li>
                        <li>Restart Vite and sign in here at <code>/admin</code>.</li>
                    </ol>
                </BentoCard>
            </div>
        );
    }

    if (authLoading) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center text-[#8a857d] font-mono text-sm">
                Checking authentication...
            </div>
        );
    }

    if (!session) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center page-transition-enter">
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
                <div className="w-full max-w-md">
                    <div className="mb-4">
                        <Link to="/" className="back-btn">
                            <BackArrow /> Back Home
                        </Link>
                    </div>
                    <BentoCard delay={0}>
                        <div className="flex items-center gap-2 text-[#ff6b00] font-mono text-xs uppercase tracking-wider mb-2">
                            <Lock className="w-4 h-4" />
                            Admin Access Only
                        </div>
                        <h1 className="text-2xl font-bold text-[#f0ece4] mb-1">
                            Portfolio Admin
                        </h1>
                        <p className="text-sm text-[#8a857d] mb-6">
                            Sign in with your Supabase admin account to manage
                            projects, experience, certificates, and messages.
                        </p>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className={labelCls}>Email</label>
                                <input
                                    type="email"
                                    required
                                    className={inputCls}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Password</label>
                                <input
                                    type="password"
                                    required
                                    className={inputCls}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={signingIn}
                                className={`${btnPrimary} w-full justify-center py-2.5`}>
                                {signingIn ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </BentoCard>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 flex flex-col gap-5 page-transition-enter">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Portfolio
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[#f0ece4]">
                            Admin Panel
                        </h1>
                        <p className="text-xs font-mono text-[#8a857d]">
                            {isUsingDatabase
                                ? "Connected to Supabase"
                                : "Database tables not seeded yet — run migrations"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={async () => {
                            await refresh();
                            notify("Data refreshed from Supabase");
                        }}
                        className={btnGhost}>
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={btnGhost}>
                        <LogOut className="w-4 h-4 text-[#ff6b00]" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition cursor-pointer ${
                            activeTab === t.id
                                ? "bg-[#ff6b00] text-black border-[#ff6b00] font-semibold"
                                : "bg-[#111111] text-[#8a857d] border-[#1f1f1f] hover:text-[#f0ece4] hover:border-[#ff6b00]/40"
                        }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
                <ProfileEditor
                    portfolio={portfolio}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async () => {
                        await refresh();
                        notify("Profile updated");
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "projects" && (
                <ProjectsManager
                    projects={portfolio.projects || []}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "experiences" && (
                <SimpleCrudManager
                    title="Experience"
                    table="experiences"
                    items={(portfolio.experience || []).map((e) => ({
                        id: e.id,
                        role: e.role,
                        company: e.company,
                        period: e.period,
                        description: e.desc,
                        sort_order: e.sort_order ?? 0,
                    }))}
                    fields={[
                        { name: "role", label: "Role / Position", required: true },
                        { name: "company", label: "Company", required: true },
                        { name: "period", label: "Period (e.g. Jan 2025 — Present)", required: true },
                        { name: "description", label: "Description", type: "textarea", required: true },
                        { name: "sort_order", label: "Sort Order", type: "number" },
                    ]}
                    renderTitle={(item) => `${item.role} @ ${item.company}`}
                    renderSubtitle={(item) => item.period}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "education" && (
                <SimpleCrudManager
                    title="Education"
                    table="education"
                    items={(portfolio.education || []).map((ed) => ({
                        id: ed.id,
                        degree: ed.degree,
                        tag: ed.tag,
                        year: ed.year,
                        institution: ed.institution,
                        grade: ed.grade,
                        grade_note: ed.gradeNote || "",
                        icon: ed.icon || "🎓",
                        sort_order: ed.sort_order ?? 0,
                    }))}
                    fields={[
                        { name: "degree", label: "Degree", required: true },
                        { name: "tag", label: "Short Tag (e.g. CSE, HSC)", required: true },
                        { name: "year", label: "Year", required: true },
                        { name: "institution", label: "Institution", required: true },
                        { name: "grade", label: "Grade", required: true },
                        { name: "grade_note", label: "Grade Note (optional)" },
                        { name: "icon", label: "Icon / Emoji" },
                        { name: "sort_order", label: "Sort Order", type: "number" },
                    ]}
                    renderTitle={(item) => `${item.degree} (${item.tag})`}
                    renderSubtitle={(item) => `${item.institution} · ${item.year}`}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "skills" && (
                <SimpleCrudManager
                    title="Skills"
                    table="skills"
                    items={portfolio.skillRows || []}
                    fields={[
                        { name: "name", label: "Skill Name", required: true },
                        { name: "sort_order", label: "Sort Order", type: "number" },
                    ]}
                    renderTitle={(item) => item.name}
                    renderSubtitle={(item) => `Order: ${item.sort_order ?? 0}`}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "interests" && (
                <SimpleCrudManager
                    title="Interests"
                    table="interests"
                    items={(portfolio.interests || []).map((it) => ({
                        id: it.id,
                        icon: it.icon,
                        label: it.label,
                        description: it.desc,
                        sort_order: it.sort_order ?? 0,
                    }))}
                    fields={[
                        { name: "icon", label: "Icon / Symbol (e.g. ◈)", required: true },
                        { name: "label", label: "Label", required: true },
                        { name: "description", label: "Description", type: "textarea", required: true },
                        { name: "sort_order", label: "Sort Order", type: "number" },
                    ]}
                    renderTitle={(item) => `${item.icon} ${item.label}`}
                    renderSubtitle={(item) => item.description}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "courses" && (
                <SimpleCrudManager
                    title="Training & Courses"
                    table="courses"
                    items={portfolio.courses || []}
                    fields={[
                        { name: "name", label: "Course / Training Name", required: true },
                        { name: "platform", label: "Platform / Institute", required: true },
                        { name: "year", label: "Year", required: true },
                        { name: "sort_order", label: "Sort Order", type: "number" },
                    ]}
                    renderTitle={(item) => item.name}
                    renderSubtitle={(item) => `${item.platform} · ${item.year}`}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "certificates" && (
                <SimpleCrudManager
                    title="Certificates"
                    table="certificates"
                    items={(portfolio.certificates || []).map((c) => ({
                        id: c.id,
                        title: c.title,
                        issuer: c.issuer,
                        issue_date: c.issueDate,
                        credential_url: c.credentialUrl,
                        image_url: c.imageUrl,
                        sort_order: c.sort_order ?? 0,
                    }))}
                    fields={[
                        { name: "title", label: "Certificate Title", required: true },
                        { name: "issuer", label: "Issuer / Organization", required: true },
                        { name: "issue_date", label: "Issue Date (e.g. May 2026)", required: true },
                        { name: "credential_url", label: "Credential URL (optional)" },
                        { name: "image_url", label: "Certificate Image", type: "image", folder: "certificates" },
                        { name: "sort_order", label: "Sort Order", type: "number" },
                    ]}
                    renderTitle={(item) => item.title}
                    renderSubtitle={(item) => `${item.issuer} · ${item.issue_date}`}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "languages" && (
                <SimpleCrudManager
                    title="Languages"
                    table="languages"
                    items={portfolio.languages || []}
                    fields={[
                        { name: "name", label: "Language", required: true },
                        { name: "level", label: "Level (e.g. Native, Fluent)", required: true },
                        { name: "proficiency", label: "Proficiency (0-100)", type: "number", required: true },
                        { name: "sort_order", label: "Sort Order", type: "number" },
                    ]}
                    renderTitle={(item) => `${item.name} (${item.level})`}
                    renderSubtitle={(item) => `${item.proficiency}%`}
                    saving={saving}
                    setSaving={setSaving}
                    onSaved={async (msg) => {
                        await refresh();
                        notify(msg);
                    }}
                    onError={(msg) => notify(msg, "error")}
                />
            )}

            {activeTab === "messages" && (
                <MessagesViewer
                    notify={notify}
                />
            )}
        </div>
    );
}

// ─── Profile Editor ─────────────────────────────────────────
function ProfileEditor({ portfolio, saving, setSaving, onSaved, onError }) {
    const [form, setForm] = useState({
        name: portfolio.name || "",
        title: portfolio.title || "",
        tagline: portfolio.tagline || "",
        email: portfolio.email || "",
        location: portfolio.location || "",
        bio: portfolio.bio || "",
        birthday_date: portfolio.birthday?.date || "",
        birthday_age: portfolio.birthday?.age || 25,
        avatar_url: portfolio.avatarUrl || "",
        social_github: portfolio.social?.github || "",
        social_facebook: portfolio.social?.facebook || "",
        social_linkedin: portfolio.social?.linkedin || "",
        social_instagram: portfolio.social?.instagram || "",
        accepting_projects: portfolio.acceptingProjects ?? true,
    });

    useEffect(() => {
        setForm({
            name: portfolio.name || "",
            title: portfolio.title || "",
            tagline: portfolio.tagline || "",
            email: portfolio.email || "",
            location: portfolio.location || "",
            bio: portfolio.bio || "",
            birthday_date: portfolio.birthday?.date || "",
            birthday_age: portfolio.birthday?.age || 25,
            avatar_url: portfolio.avatarUrl || "",
            social_github: portfolio.social?.github || "",
            social_facebook: portfolio.social?.facebook || "",
            social_linkedin: portfolio.social?.linkedin || "",
            social_instagram: portfolio.social?.instagram || "",
            accepting_projects: portfolio.acceptingProjects ?? true,
        });
    }, [portfolio]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile({
                ...form,
                birthday_age: Number(form.birthday_age) || 25,
            });
            await onSaved();
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setSaving(true);
        try {
            const url = await uploadPortfolioAsset(file, "avatar");
            setForm((f) => ({ ...f, avatar_url: url }));
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <BentoCard delay={0}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-[#f0ece4]">
                        Profile & About Me
                    </h2>
                    <button type="submit" disabled={saving} className={btnPrimary}>
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Profile"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Full Name</label>
                        <input
                            className={inputCls}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Title / Role</label>
                        <input
                            className={inputCls}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Tagline</label>
                        <input
                            className={inputCls}
                            value={form.tagline}
                            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input
                            type="email"
                            className={inputCls}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Location</label>
                        <input
                            className={inputCls}
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Birthday</label>
                            <input
                                className={inputCls}
                                value={form.birthday_date}
                                onChange={(e) =>
                                    setForm({ ...form, birthday_date: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Fallback Age</label>
                            <input
                                type="number"
                                className={inputCls}
                                value={form.birthday_age}
                                onChange={(e) =>
                                    setForm({ ...form, birthday_age: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className={labelCls}>Bio</label>
                    <textarea
                        rows={4}
                        className={inputCls}
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>GitHub URL</label>
                        <input
                            className={inputCls}
                            value={form.social_github}
                            onChange={(e) =>
                                setForm({ ...form, social_github: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className={labelCls}>LinkedIn URL</label>
                        <input
                            className={inputCls}
                            value={form.social_linkedin}
                            onChange={(e) =>
                                setForm({ ...form, social_linkedin: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Facebook URL</label>
                        <input
                            className={inputCls}
                            value={form.social_facebook}
                            onChange={(e) =>
                                setForm({ ...form, social_facebook: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Instagram URL</label>
                        <input
                            className={inputCls}
                            value={form.social_instagram}
                            onChange={(e) =>
                                setForm({ ...form, social_instagram: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <label className={labelCls}>Avatar URL (optional)</label>
                        <div className="flex gap-2">
                            <input
                                className={inputCls}
                                value={form.avatar_url}
                                onChange={(e) =>
                                    setForm({ ...form, avatar_url: e.target.value })
                                }
                            />
                            <label className={btnGhost}>
                                <Upload className="w-4 h-4" />
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </label>
                        </div>
                    </div>
                    <label className="flex items-center gap-2.5 text-sm text-[#f0ece4] cursor-pointer pt-4">
                        <input
                            type="checkbox"
                            checked={form.accepting_projects}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    accepting_projects: e.target.checked,
                                })
                            }
                            className="accent-[#ff6b00] w-4 h-4"
                        />
                        Currently accepting new projects
                    </label>
                </div>
            </form>
        </BentoCard>
    );
}

// ─── Projects Manager ───────────────────────────────────────
function ProjectsManager({ projects, saving, setSaving, onSaved, onError }) {
    const emptyForm = {
        id: null,
        title: "",
        slug: "",
        category: "Web App",
        year: String(new Date().getFullYear()),
        description: "",
        long_description: "",
        tagsText: "",
        imagesText: "",
        github: "#",
        live: "#",
        featured: false,
        sort_order: projects.length + 1,
    };

    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const startCreate = () => {
        setForm({ ...emptyForm, sort_order: projects.length + 1 });
        setEditing("new");
    };

    const startEdit = (p) => {
        setForm({
            id: p.id,
            title: p.title || "",
            slug: p.slug || "",
            category: p.category || "Web App",
            year: p.year || "",
            description: p.description || "",
            long_description: p.longDescription || "",
            tagsText: (p.tags || []).join(", "),
            imagesText: (p.image || []).join("\n"),
            github: p.github || "#",
            live: p.live || "#",
            featured: Boolean(p.featured),
            sort_order: p.sort_order ?? 0,
        });
        setEditing(p.id);
    };

    const handleUploadImages = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = "";
        if (!files.length) return;
        setSaving(true);
        try {
            const urls = await Promise.all(
                files.map((f) => uploadPortfolioAsset(f, "projects")),
            );
            setForm((prev) => ({
                ...prev,
                imagesText: [prev.imagesText.trim(), ...urls]
                    .filter(Boolean)
                    .join("\n"),
            }));
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...(form.id ? { id: form.id } : {}),
                title: form.title,
                slug: form.slug || slugify(form.title),
                category: form.category,
                year: form.year,
                description: form.description,
                long_description: form.long_description || null,
                tags: form.tagsText
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                images: form.imagesText
                    .split(/\r?\n/)
                    .map((s) => s.trim())
                    .filter(Boolean),
                github: form.github || "#",
                live: form.live || "#",
                featured: Boolean(form.featured),
                sort_order: Number(form.sort_order) || 0,
                updated_at: new Date().toISOString(),
            };
            await upsertRow("projects", payload);
            setEditing(null);
            await onSaved(form.id ? "Project updated" : "Project created");
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        setSaving(true);
        try {
            await deleteRow("projects", id);
            await onSaved("Project deleted");
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            {editing !== null && (
                <BentoCard delay={0}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#f0ece4]">
                                {editing === "new" ? "Add New Project" : "Edit Project"}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className={btnGhost}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={btnPrimary}>
                                    <Save className="w-4 h-4" />
                                    {saving ? "Saving..." : "Save Project"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelCls}>Title</label>
                                <input
                                    className={inputCls}
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({ ...form, title: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Slug (URL)</label>
                                <input
                                    className={inputCls}
                                    value={form.slug}
                                    onChange={(e) =>
                                        setForm({ ...form, slug: e.target.value })
                                    }
                                    placeholder="auto-generated-from-title"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Category</label>
                                <input
                                    className={inputCls}
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    placeholder="Web App / Landing Page / Website"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>Year</label>
                                    <input
                                        className={inputCls}
                                        value={form.year}
                                        onChange={(e) =>
                                            setForm({ ...form, year: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Order</label>
                                    <input
                                        type="number"
                                        className={inputCls}
                                        value={form.sort_order}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                sort_order: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelCls}>Short Description</label>
                            <textarea
                                rows={3}
                                className={inputCls}
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className={labelCls}>
                                Detailed Case Study / Long Description (shown on Project Details page)
                            </label>
                            <textarea
                                rows={4}
                                className={inputCls}
                                value={form.long_description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        long_description: e.target.value,
                                    })
                                }
                                placeholder="Optional deeper write-up, challenges, architecture..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelCls}>
                                    Tags (comma-separated)
                                </label>
                                <input
                                    className={inputCls}
                                    value={form.tagsText}
                                    onChange={(e) =>
                                        setForm({ ...form, tagsText: e.target.value })
                                    }
                                    placeholder="React, TailwindCSS, Supabase"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Live URL</label>
                                <input
                                    className={inputCls}
                                    value={form.live}
                                    onChange={(e) =>
                                        setForm({ ...form, live: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className={labelCls}>GitHub URL</label>
                                <input
                                    className={inputCls}
                                    value={form.github}
                                    onChange={(e) =>
                                        setForm({ ...form, github: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className={labelCls}>
                                    Images (one URL per line, or upload)
                                </label>
                                <label className={`${btnGhost} py-1 px-2.5 text-xs`}>
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload Images
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleUploadImages}
                                    />
                                </label>
                            </div>
                            <textarea
                                rows={3}
                                className={inputCls}
                                value={form.imagesText}
                                onChange={(e) =>
                                    setForm({ ...form, imagesText: e.target.value })
                                }
                                placeholder="/assets/example-1.png"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-[#f0ece4] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.featured}
                                onChange={(e) =>
                                    setForm({ ...form, featured: e.target.checked })
                                }
                                className="accent-[#ff6b00] w-4 h-4"
                            />
                            Featured / Work in Progress
                        </label>
                    </form>
                </BentoCard>
            )}

            <BentoCard delay={0}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#f0ece4]">
                        Projects ({projects.length})
                    </h2>
                    <button
                        type="button"
                        onClick={startCreate}
                        className={btnPrimary}>
                        <Plus className="w-4 h-4" />
                        Add Project
                    </button>
                </div>

                <div className="space-y-2.5">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-3.5">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-[#f0ece4] truncate">
                                        {p.title}
                                    </span>
                                    <span className="text-xs font-mono text-[#ff6b00]">
                                        {p.category} · {p.year}
                                    </span>
                                </div>
                                <p className="text-xs text-[#8a857d] truncate mt-0.5">
                                    {p.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => startEdit(p)}
                                    className={btnGhost}>
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(p.id)}
                                    className="p-2 rounded-xl border border-[#1f1f1f] text-red-400 hover:border-red-500/60 transition cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </BentoCard>
        </div>
    );
}

// ─── Generic CRUD Manager for Other Sections ────────────────
function SimpleCrudManager({
    title,
    table,
    items,
    fields,
    renderTitle,
    renderSubtitle,
    saving,
    setSaving,
    onSaved,
    onError,
}) {
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});

    const startCreate = () => {
        const init = { sort_order: items.length + 1 };
        fields.forEach((f) => {
            if (f.name !== "sort_order") init[f.name] = f.type === "number" ? 0 : "";
        });
        setForm(init);
        setEditing("new");
    };

    const startEdit = (item) => {
        setForm({ ...item });
        setEditing(item.id);
    };

    const handleImageUpload = async (field, e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setSaving(true);
        try {
            const url = await uploadPortfolioAsset(file, field.folder || "uploads");
            setForm((prev) => ({ ...prev, [field.name]: url }));
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {};
            if (form.id) payload.id = form.id;
            fields.forEach((f) => {
                if (f.type === "number") {
                    payload[f.name] = Number(form[f.name]) || 0;
                } else {
                    payload[f.name] = form[f.name] ?? "";
                }
            });
            await upsertRow(table, payload);
            setEditing(null);
            await onSaved(form.id ? `${title} updated` : `${title} added`);
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Delete this ${title.toLowerCase()} item?`)) return;
        setSaving(true);
        try {
            await deleteRow(table, id);
            await onSaved(`${title} deleted`);
        } catch (err) {
            onError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            {editing !== null && (
                <BentoCard delay={0}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#f0ece4]">
                                {editing === "new" ? `Add ${title}` : `Edit ${title}`}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className={btnGhost}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={btnPrimary}>
                                    <Save className="w-4 h-4" />
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((f) => (
                                <div
                                    key={f.name}
                                    className={
                                        f.type === "textarea" || f.type === "image"
                                            ? "md:col-span-2"
                                            : ""
                                    }>
                                    <label className={labelCls}>{f.label}</label>
                                    {f.type === "textarea" ? (
                                        <textarea
                                            rows={3}
                                            className={inputCls}
                                            required={f.required}
                                            value={form[f.name] ?? ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [f.name]: e.target.value,
                                                })
                                            }
                                        />
                                    ) : f.type === "image" ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    className={inputCls}
                                                    value={form[f.name] ?? ""}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            [f.name]: e.target.value,
                                                        })
                                                    }
                                                    placeholder="https://... or upload"
                                                />
                                                <label className={btnGhost}>
                                                    <Upload className="w-4 h-4" />
                                                    Upload
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleImageUpload(f, e)
                                                        }
                                                    />
                                                </label>
                                            </div>
                                            {form[f.name] && (
                                                <img
                                                    src={form[f.name]}
                                                    alt="Preview"
                                                    className="h-24 rounded-lg border border-[#1f1f1f] object-cover"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type={f.type || "text"}
                                            className={inputCls}
                                            required={f.required}
                                            value={form[f.name] ?? ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [f.name]: e.target.value,
                                                })
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </form>
                </BentoCard>
            )}

            <BentoCard delay={0}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#f0ece4]">
                        {title} ({items.length})
                    </h2>
                    <button
                        type="button"
                        onClick={startCreate}
                        className={btnPrimary}>
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>

                {items.length === 0 ? (
                    <p className="text-sm text-[#8a857d]">No items yet.</p>
                ) : (
                    <div className="space-y-2.5">
                        {items.map((item, idx) => (
                            <div
                                key={item.id || idx}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-3.5">
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-[#f0ece4] truncate">
                                        {renderTitle(item)}
                                    </div>
                                    <div className="text-xs text-[#8a857d] truncate mt-0.5">
                                        {renderSubtitle(item)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(item)}
                                        className={btnGhost}>
                                        <Edit3 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 rounded-xl border border-[#1f1f1f] text-red-400 hover:border-red-500/60 transition cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </BentoCard>
        </div>
    );
}

// ─── Contact Messages Viewer ────────────────────────────────
function MessagesViewer({ notify }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchContactMessages();
            setMessages(data);
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setLoading(false);
        }
    }, [notify]);

    useEffect(() => {
        load();
    }, [load]);

    const toggleRead = async (msg) => {
        try {
            await markMessageRead(msg.id, !msg.is_read);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === msg.id ? { ...m, is_read: !m.is_read } : m,
                ),
            );
        } catch (err) {
            notify(err.message, "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await deleteRow("contact_messages", id);
            setMessages((prev) => prev.filter((m) => m.id !== id));
            notify("Message deleted");
        } catch (err) {
            notify(err.message, "error");
        }
    };

    return (
        <BentoCard delay={0}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#f0ece4] flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#ff6b00]" />
                    Contact Messages ({messages.length})
                </h2>
                <button type="button" onClick={load} className={btnGhost}>
                    <RefreshCw className="w-4 h-4" />
                    Reload
                </button>
            </div>

            {loading ? (
                <p className="text-sm text-[#8a857d]">Loading messages...</p>
            ) : messages.length === 0 ? (
                <p className="text-sm text-[#8a857d]">No messages received yet.</p>
            ) : (
                <div className="space-y-3">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`rounded-xl border p-4 transition ${
                                m.is_read
                                    ? "border-[#1f1f1f] bg-[#0a0a0a] opacity-75"
                                    : "border-[#ff6b00]/40 bg-[#120d0a]"
                            }`}>
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                    <div className="font-semibold text-[#f0ece4]">
                                        {m.name}{" "}
                                        <span className="text-xs font-mono text-[#ff6b00] ml-2">
                                            {m.project_type}
                                        </span>
                                    </div>
                                    <div className="text-xs text-[#8a857d]">
                                        {m.email} ·{" "}
                                        {new Date(m.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleRead(m)}
                                        className={btnGhost}>
                                        {m.is_read ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-[#ff6b00]" />
                                        )}
                                        {m.is_read ? "Read" : "Mark Read"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(m.id)}
                                        className="p-2 rounded-xl border border-[#1f1f1f] text-red-400 hover:border-red-500/60 transition cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-[#f0ece4]/90 whitespace-pre-line">
                                {m.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </BentoCard>
    );
}
