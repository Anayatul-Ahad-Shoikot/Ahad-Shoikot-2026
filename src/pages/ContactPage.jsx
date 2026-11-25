import { useState } from "react";
import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import { usePortfolio } from "../context/PortfolioContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { submitContactMessage } from "../services/portfolioService";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import { Puzzle, DraftingCompass, Smartphone, Gauge } from "lucide-react";

function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [focused, setFocused] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [toast, setToast] = useState(null);

    const projectTypes = [
        "Website",
        "Web App",
        "Landing Page",
        "E-commerce",
        "Other",
    ];

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("access_key", "b9d9569a-17fe-408b-8a4f-9b021a3c5a52");
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("projectType", selectedProject || "Not specified");
        formData.append("message", form.message);

        try {
            let dbSaved = false;
            if (isSupabaseConfigured) {
                try {
                    await submitContactMessage({
                        name: form.name,
                        email: form.email,
                        projectType: selectedProject || "Not specified",
                        message: form.message,
                    });
                    dbSaved = true;
                } catch (dbErr) {
                    console.warn("Supabase contact insert failed:", dbErr);
                }
            }

            let web3Ok = false;
            try {
                const res = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                web3Ok = Boolean(data.success);
            } catch {
                // Ignore Web3Forms network failure if DB saved
            }

            if (dbSaved || web3Ok) {
                showToast("Message sent successfully!", "success");

                setSubmitted(true);
                setForm({ name: "", email: "", message: "" });
                setSelectedProject(null);
            } else {
                showToast("Something went wrong. Try again.", "error");
            }
        } catch {
            showToast("Network error. Try again.", "error");
        }

        setLoading(false);
    };

    if (submitted) {
        return (
            <>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
                <div className="cf-success">
                    <div className="cf-success-icon">✓</div>
                    <div className="cf-success-title">Message Sent!</div>
                    <p className="cf-success-desc mb-4">
                        Thanks for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <button
                        type="button"
                        className="cf-submit"
                        onClick={() => setSubmitted(false)}>
                        Send Another Message
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <form className="cf-form" onSubmit={handleSubmit}>
                <div className="cf-row">
                    <div className="cf-field">
                        <label className="cf-label">Name</label>
                        <input
                            name="name"
                            className={`cf-input ${focused === "name" ? "cf-input-focus" : ""}`}
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            onFocus={() => setFocused("name")}
                            onBlur={() => setFocused(null)}
                            required
                        />
                    </div>

                    <div className="cf-field">
                        <label className="cf-label">Email</label>
                        <input
                            name="email"
                            className={`cf-input ${focused === "email" ? "cf-input-focus" : ""}`}
                            placeholder="your@email.com"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused(null)}
                            required
                        />
                    </div>
                </div>

                <div className="cf-field">
                    <label className="cf-label">Project Type</label>
                    <div className="cf-chips">
                        {projectTypes.map((type) => (
                            <button
                                type="button"
                                key={type}
                                className={`cf-chip ${
                                    selectedProject === type
                                        ? "cf-chip-active"
                                        : ""
                                }`}
                                onClick={() => setSelectedProject(type)}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cf-field">
                    <label className="cf-label">Message</label>
                    <textarea
                        name="message"
                        className={`cf-input cf-textarea ${focused === "msg" ? "cf-input-focus" : ""}`}
                        placeholder="Tell me about your project..."
                        rows={4}
                        value={form.message}
                        onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                        }
                        onFocus={() => setFocused("msg")}
                        onBlur={() => setFocused(null)}
                        required
                    />
                </div>

                <button type="submit" className="cf-submit" disabled={loading}>
                    <span>{loading ? "Sending..." : "Send Message"}</span>
                </button>
            </form>
        </>
    );
}

function FAQSection() {
    const [openIdx, setOpenIdx] = useState(null);

    const faqs = [
        {
            q: "What's your typical project timeline?",
            a: "Most projects take 2–6 weeks depending on scope. A simple landing page might be done in a week, while a full web app could take 4–6 weeks.",
        },
        {
            q: "Do you work with international clients?",
            a: "Absolutely! I collaborate with clients globally. Time zone differences are never an issue — I'm flexible with scheduling.",
        },
        {
            q: "What's your pricing structure?",
            a: "I offer both fixed-price and hourly options. Every project starts with a free consultation to understand your needs and provide a tailored quote.",
        },
        {
            q: "Do you provide post-launch support?",
            a: "Yes! Every project includes 2 weeks of free bug fixes after launch. Extended maintenance plans are also available.",
        },
    ];

    return (
        <div className="faq-list">
            {faqs.map((faq, idx) => (
                <button
                    type="button"
                    key={idx}
                    aria-expanded={openIdx === idx}
                    className={`faq-item ${openIdx === idx ? "faq-item-open" : ""}`}
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
                    <div className="faq-question">
                        <span>{faq.q}</span>
                        <span
                            className={`faq-arrow ${openIdx === idx ? "faq-arrow-open" : ""}`}>
                            ›
                        </span>
                    </div>
                    <div
                        className={`faq-answer ${openIdx === idx ? "faq-answer-open" : ""}`}>
                        {faq.a}
                    </div>
                </button>
            ))}
        </div>
    );
}

export default function ContactPage() {
    const { portfolio: PORTFOLIO } = usePortfolio();
    const services = [
        {
            icon: <Puzzle stroke="#ff6b00" />,
            label: "Frontend Dev",
            desc: "React, Next.js, Vue",
        },
        {
            icon: <DraftingCompass stroke="#ff6b00" />,
            label: "UI/UX",
            desc: "Figma to Code",
        },
        {
            icon: <Smartphone stroke="#ff6b00" />,
            label: "Responsive",
            desc: "Mobile-first design",
        },
        {
            icon: <Gauge stroke="#ff6b00" />,
            label: "Performance",
            desc: "Optimized & fast",
        },
    ];

    const processSteps = [
        { num: "01", title: "Discovery", desc: "Goals, scope & timeline" },
        { num: "02", title: "Design", desc: "Wireframes & visual direction" },
        { num: "03", title: "Build", desc: "Responsive, clean code" },
        { num: "04", title: "Launch", desc: "Testing & post-launch support" },
    ];

    const availability = [
        { day: "Mon", on: true },
        { day: "Tue", on: true },
        { day: "Wed", on: true },
        { day: "Thu", on: true },
        { day: "Fri", on: true },
        { day: "Sat", on: true },
        { day: "Sun", on: false },
    ];

    return (
        <div className="w-full flex-1 flex flex-col page-transition-enter">
            <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-dense gap-5">
                <div className="flex flex-col items-center justify-center">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">Contact</h1>
                    <p className="page-subtitle">
                        Let's create something extraordinary
                    </p>
                </div>

                <BentoCard className="contact-main sm:col-span-2" delay={0}>
                    <div className="card-label">Get In Touch</div>
                    <div className="contact-big-text">
                        Got a project idea?
                        <br />
                        Let's make it real.
                    </div>
                    <a
                        className="contact-email"
                        href={`mailto:${PORTFOLIO.email}`}>
                        {PORTFOLIO.email}
                    </a>
                    <div
                        className="status-indicator"
                        style={{ marginTop: "24px" }}>
                        <span className="status-dot" />
                        {PORTFOLIO.acceptingProjects !== false
                            ? "Currently accepting new projects"
                            : "Currently booked · Limited availability"}
                    </div>
                </BentoCard>

                <BentoCard delay={140} className="lg:row-span-2">
                    <div className="card-label">Services</div>
                    <div className="card-title">What I Do</div>
                    <div className="svc-grid" style={{ marginTop: 5 }}>
                        {services.map((s, i) => (
                            <div key={i} className="svc-item">
                                <div className="svc-icon">{s.icon}</div>
                                <div className="svc-label">{s.label}</div>
                                <div className="svc-desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-5 border-t border-[#1f1f1f]">
                        <div className="card-label">Availability</div>
                        <div className="flex items-center justify-between text-xs text-[#8a857d] font-mono mb-2">
                            <span>GMT+6 · {PORTFOLIO.location}</span>
                            <span className="text-[#ff6b00]">~24h reply</span>
                        </div>
                        <div className="avail-grid">
                            {availability.map((d) => (
                                <div key={d.day} className="avail-day">
                                    <div className="avail-day-label">{d.day}</div>
                                    <div
                                        className={`avail-dot ${
                                            d.on ? "avail-dot-on" : "avail-dot-off"
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

                <BentoCard delay={260} className="sm:col-span-2 lg:col-span-2">
                    <div className="card-label">Socials</div>
                    <div className="card-title">Find Me Online</div>
                    <div>
                        {Object.entries(PORTFOLIO.social || {})
                            .filter(([, handle]) => Boolean(handle && handle.trim()))
                            .map(([platform, handle]) => (
                                <a
                                    key={platform}
                                    href={handle}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="social-link">
                                    <span className="social-platform">
                                        {platform}
                                    </span>
                                    <span>{handle}</span>
                                </a>
                            ))}
                    </div>
                </BentoCard>

                <BentoCard delay={300} className="sm:col-span-2 md:col-span-1">
                    <div className="card-label">Process</div>
                    <div className="card-title">How I Work</div>
                    <div className="proc-steps">
                        {processSteps.map((step) => (
                            <div key={step.num} className="proc-step">
                                <span className="proc-num">{step.num}</span>
                                <div className="proc-info">
                                    <div className="proc-title">{step.title}</div>
                                    <div className="proc-desc">{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoCard>

                <BentoCard delay={480} className="sm:col-span-2 md:col-span-2 lg:col-span-2">
                    <div className="card-label">FAQ</div>
                    <div className="card-title">Common Questions</div>
                    <FAQSection />
                </BentoCard>

                <BentoCard
                    className="sm:col-span-2 md:col-span-3 lg:col-span-2"
                    delay={320}>
                    <div className="card-label">Send a Message</div>
                    <div className="card-title" style={{ marginBottom: 16 }}>
                        Let's Talk
                    </div>
                    <ContactForm />
                </BentoCard>
            </div>
        </div>
    );
}
