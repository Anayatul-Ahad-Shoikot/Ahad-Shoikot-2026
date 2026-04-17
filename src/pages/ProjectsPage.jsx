import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import PORTFOLIO from "../data/portfolio";

const GithubIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

const ExternalIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const StarIcon = () => (
    <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="#FF6B2B"
        stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

function ProjectCard({ project, index, featured = false }) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    return (
        <div
            ref={cardRef}
            className={`proj-card ${featured ? "proj-card-featured" : ""}`}
            style={{ animationDelay: `${index * 80}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div className="proj-thumb-wrap">
                <img
                    src={project.image}
                    alt={project.title}
                    className="proj-thumb"
                    loading="lazy"
                />
                <div
                    className={`proj-thumb-overlay ${isHovered ? "proj-thumb-overlay-show" : ""}`}>
                    <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-overlay-btn proj-overlay-btn-primary">
                        <ExternalIcon />
                        <span>Live Preview</span>
                    </a>
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-overlay-btn proj-overlay-btn-secondary">
                        <GithubIcon />
                        <span>Source</span>
                    </a>
                </div>

                {featured && (
                    <div className="proj-badge">
                        <StarIcon />
                        <span>Featured</span>
                    </div>
                )}

                <div className="proj-category">{project.category}</div>
            </div>

            <div className="proj-body">
                <div className="proj-top-row">
                    <h3 className="proj-title">{project.title}</h3>
                    <span className="proj-year">{project.year}</span>
                </div>

                <p className="proj-desc">{project.description}</p>

                <div className="proj-tags">
                    {project.tags.map((tag) => (
                        <span key={tag} className="proj-tag">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="proj-links">
                    <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-link proj-link-primary">
                        <ExternalIcon />
                        <span>Live Preview</span>
                    </a>
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-link proj-link-ghost">
                        <GithubIcon />
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const [filter, setFilter] = useState("All");
    const categories = [
        "All",
        ...new Set(PORTFOLIO.projects.map((p) => p.category)),
    ];
    const filtered =
        filter === "All"
            ? PORTFOLIO.projects
            : PORTFOLIO.projects.filter((p) => p.category === filter);

    const featured = filtered.filter((p) => p.featured);
    const regular = filtered.filter((p) => !p.featured);
    return (
        <div className="w-full h-full page-transition-enter">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="flex flex-col items-center justify-center">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">Things I've built & shipped</p>
                </div>

                {/* Stats + Filter card */}
                <BentoCard delay={0} className="md:col-span-2">
                    <div className="card-label">Overview</div>
                    <div
                        className="proj-stats-row"
                        style={{ marginBottom: 20 }}>
                        <div className="proj-stat">
                            <div className="proj-stat-num">
                                {PORTFOLIO.projects.length}
                            </div>
                            <div className="proj-stat-label">Projects</div>
                        </div>
                        <div className="proj-stat">
                            <div className="proj-stat-num">
                                {PORTFOLIO.projects.filter((p) => p.featured).length}
                            </div>
                            <div className="proj-stat-label">Featured</div>
                        </div>
                        <div className="proj-stat">
                            <div className="proj-stat-num">
                                {new Set(PORTFOLIO.projects.flatMap((p) => p.tags)).size}+
                            </div>
                            <div className="proj-stat-label">Technologies</div>
                        </div>
                    </div>
                    <div className="proj-section-label">Filter by</div>
                    <div className="proj-filters">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`proj-filter-btn ${filter === cat ? "proj-filter-btn-active" : ""}`}
                                onClick={() => setFilter(cat)}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </BentoCard>

                {/* Tech highlight card */}
                <BentoCard delay={160}>
                    <div className="card-label">Primary Stack</div>
                    <div
                        className="card-title"
                        style={{ fontSize: "1rem", marginBottom: 8 }}>
                        Built With
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {[
                            "React",
                            "Next.js",
                            "TailwindCSS",
                            "Node.js",
                            "Framer Motion",
                        ].map((t) => (
                            <span
                                key={t}
                                className="proj-tag"
                                style={{ fontSize: 12, padding: "5px 12px" }}>
                                {t}
                            </span>
                        ))}
                    </div>
                </BentoCard>

                {/* ═══ Projects Grid (full width below) ═══ */}
                <div style={{ gridColumn: "1 / -1" }}>
                    <div className="proj-grid">
                        {featured.map((project, i) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={i}
                                featured={true}
                            />
                        ))}
                        {regular.map((project, i) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={i + featured.length}
                                featured={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
