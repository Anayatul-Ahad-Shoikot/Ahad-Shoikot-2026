import { useState } from "react";
import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import PORTFOLIO from "../data/portfolio";
import { Link } from "react-router-dom";

function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [focused, setFocused] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const projectTypes = [
        "Website",
        "Web App",
        "Landing Page",
        "E-commerce",
        "Other",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            "form-name": "contact",
            name: form.name,
            email: form.email,
            projectType: selectedProject,
            message: form.message,
        };

        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(payload).toString(),
        });

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    if (submitted) {
        return (
            <div className="cf-success">
                <div className="cf-success-icon">✓</div>
                <div className="cf-success-title">Message Sent!</div>
                <div className="cf-success-desc">
                    I'll get back to you within 24 hours.
                </div>
            </div>
        );
    }

    return (
        <>
            <form name="contact" method="POST" data-netlify="true" hidden>
                <input type="text" name="name" />
                <input type="email" name="email" />
                <input type="text" name="projectType" />
                <textarea name="message"></textarea>
            </form>

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
                                className={`cf-chip ${selectedProject === type ? "cf-chip-active" : ""}`}
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

                <button type="submit" className="cf-submit">
                    <span>Send Message</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
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
                <div
                    key={idx}
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
                </div>
            ))}
        </div>
    );
}

export default function ContactPage() {
    const services = [
        { icon: "⚡", label: "Frontend Dev", desc: "React, Next.js, Vue" },
        { icon: "🎨", label: "UI/UX", desc: "Figma to Code" },
        { icon: "📱", label: "Responsive", desc: "Mobile-first design" },
        { icon: "🚀", label: "Performance", desc: "Optimized & fast" },
    ];

    return (
        <div className="w-full h-full page-transition-enter">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="flex flex-col items-center justify-center">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">Contact</h1>
                    <p className="page-subtitle">
                        Let's create something extraordinary
                    </p>
                </div>

                <BentoCard className="contact-main" delay={0}>
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
                        Currently accepting new projects
                    </div>
                </BentoCard>

                <BentoCard delay={140} style={{ gridRow: "span 2" }}>
                    <div className="card-label">Services</div>
                    <div className="card-title">What I Do</div>
                    <div className="svc-grid" style={{ marginTop: 12 }}>
                        {services.map((s, i) => (
                            <div key={i} className="svc-item">
                                <div className="svc-icon">{s.icon}</div>
                                <div className="svc-label">{s.label}</div>
                                <div className="svc-desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </BentoCard>

                <BentoCard delay={260} style={{ gridColumn: "span 2" }}>
                    <div className="card-label">Socials</div>
                    <div className="card-title">Find Me Online</div>
                    <div>
                        {Object.entries(PORTFOLIO.social).map(
                            ([platform, handle]) => (
                                <div key={platform} className="social-link">
                                    <span className="social-platform">
                                        {platform}
                                    </span>
                                    <span>{handle}</span>
                                </div>
                            ),
                        )}
                    </div>
                </BentoCard>

                <BentoCard delay={480} style={{ gridColumn: "span 3" }}>
                    <div className="card-label">FAQ</div>
                    <div className="card-title" style={{ marginBottom: 12 }}>
                        Common Questions
                    </div>
                    <FAQSection />
                </BentoCard>

                <BentoCard
                    className="md:col-span-2"
                    delay={320}
                    style={{ gridColumn: "span 2", gridRow: "span 2" }}>
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
