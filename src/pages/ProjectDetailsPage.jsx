import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import { usePortfolio } from "../context/PortfolioContext";
import {
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Star,
    Calendar,
    Layers,
} from "lucide-react";

const GithubIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const { portfolio, loading } = usePortfolio();
    const projects = portfolio.projects || [];

    const currentIndex = projects.findIndex(
        (p) => String(p.id) === String(id) || p.slug === id,
    );
    const project = currentIndex >= 0 ? projects[currentIndex] : null;

    const [imgSelection, setImgSelection] = useState({ id: null, index: 0 });
    const activeImg = imgSelection.id === id ? imgSelection.index : 0;

    if (!project && loading) {
        return (
            <div className="w-full min-h-[70vh] flex items-center justify-center text-[#8a857d] font-mono text-sm">
                Loading project...
            </div>
        );
    }

    if (!project) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center page-transition-enter">
                <h1 className="page-title">Project Not Found</h1>
                <p className="page-subtitle mb-6">
                    The project you are looking for doesn&apos;t exist or was
                    removed.
                </p>
                <Link to="/projects" className="back-btn">
                    <BackArrow /> Back to Projects
                </Link>
            </div>
        );
    }

    const images = Array.isArray(project.image)
        ? project.image.filter(Boolean)
        : project.image
          ? [project.image]
          : [];

    const prevProject =
        currentIndex > 0 ? projects[currentIndex - 1] : null;
    const nextProject =
        currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

    const handlePrevImg = () => {
        setImgSelection({
            id,
            index: (activeImg - 1 + images.length) % images.length,
        });
    };

    const handleNextImg = () => {
        setImgSelection({
            id,
            index: (activeImg + 1) % images.length,
        });
    };

    return (
        <div className="w-full flex-1 flex flex-col page-transition-enter">
            <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {/* Top-Left Standard Header (Matches all other pages) */}
                <div className="flex flex-col items-center justify-center text-center">
                    <Link to="/projects" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">{project.title}</h1>
                    <p className="page-subtitle">
                        {project.category} · {project.year}
                    </p>
                    {project.featured && (
                        <span className="mt-3 px-3 py-1 rounded-full border border-[#ff6b00]/40 bg-[#ff6b00]/10 text-[#ff6b00] text-xs font-mono inline-flex items-center gap-1.5">
                            <Star className="w-3 h-3 fill-[#ff6b00]" />
                            Work in progress
                        </span>
                    )}
                </div>

                {/* Top-Right Compact Image Gallery */}
                <BentoCard
                    className="sm:col-span-2 md:col-span-2 lg:col-span-3"
                    delay={0}>
                    {images.length > 0 ? (
                        <div className="flex flex-col gap-3 h-full">
                            <div className="relative w-full h-60 sm:h-72 lg:h-80 rounded-xl overflow-hidden border border-[#1f1f1f] bg-[#0a0a0a]">
                                <img
                                    src={images[activeImg]}
                                    alt={`${project.title} screenshot ${activeImg + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrevImg}
                                            aria-label="Previous image"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-white/10 text-white hover:border-[#ff6b00] hover:text-[#ff6b00] transition cursor-pointer">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextImg}
                                            aria-label="Next image"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-white/10 text-white hover:border-[#ff6b00] hover:text-[#ff6b00] transition cursor-pointer">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 text-xs font-mono text-[#f0ece4] border border-white/10">
                                            {activeImg + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-2.5 overflow-x-auto pb-1">
                                    {images.map((src, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() =>
                                                setImgSelection({ id, index: i })
                                            }
                                            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border transition cursor-pointer ${
                                                i === activeImg
                                                    ? "border-[#ff6b00] ring-1 ring-[#ff6b00]"
                                                    : "border-[#1f1f1f] opacity-60 hover:opacity-100"
                                            }`}>
                                            <img
                                                src={src}
                                                alt={`Thumbnail ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-60 sm:h-72 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] flex items-center justify-center text-[#8a857d] text-sm">
                            No preview images available
                        </div>
                    )}
                </BentoCard>

                {/* Row 2 Left: Overview */}
                <BentoCard
                    className="sm:col-span-2 md:col-span-2 lg:col-span-2"
                    delay={100}>
                    <div className="card-label">About This Project</div>
                    <h2 className="card-title mb-3">Overview</h2>
                    <p className="text-sm sm:text-base text-[#f0ece4]/90 leading-relaxed whitespace-pre-line">
                        {project.description}
                    </p>
                    {project.longDescription && (
                        <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-[#ff6b00] mb-1.5">
                                Case Study & Implementation
                            </h3>
                            <p className="text-sm text-[#8a857d] leading-relaxed whitespace-pre-line">
                                {project.longDescription}
                            </p>
                        </div>
                    )}
                </BentoCard>

                {/* Row 2 Right: Project Details (Same Row as Overview) */}
                <BentoCard
                    className="sm:col-span-2 md:col-span-1 lg:col-span-2"
                    delay={160}>
                    <div className="flex flex-col h-full gap-4">
                        <div>
                            <div className="card-label">Project Details</div>
                            <h2 className="card-title">Stack & Links</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm text-[#8a857d] border-y border-[#1f1f1f] py-3">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-[#ff6b00] shrink-0" />
                                <div>
                                    <div className="text-[11px] font-mono uppercase text-[#8a857d]">
                                        Category
                                    </div>
                                    <div className="text-[#f0ece4] font-medium">
                                        {project.category}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#ff6b00] shrink-0" />
                                <div>
                                    <div className="text-[11px] font-mono uppercase text-[#8a857d]">
                                        Year
                                    </div>
                                    <div className="text-[#f0ece4] font-medium">
                                        {project.year}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="card-label mb-2">Tech Stack</div>
                            <div className="flex flex-wrap gap-2">
                                {(project.tags || []).map((tag) => (
                                    <span key={tag} className="proj-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-3 pt-2">
                            {project.live && project.live !== "#" && (
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="proj-link proj-link-primary flex-1 justify-center py-2.5">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Live Preview</span>
                                </a>
                            )}
                            {project.github && project.github !== "#" && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="proj-link proj-link-ghost flex-1 justify-center py-2.5">
                                    <GithubIcon />
                                    <span>View Source</span>
                                </a>
                            )}
                        </div>
                    </div>
                </BentoCard>

                {/* Bottom Row: Previous / Next Project Navigation */}
                {(prevProject || nextProject) && (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prevProject ? (
                            <Link
                                to={`/projects/${prevProject.id}`}
                                className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-4 hover:border-[#ff6b00]/50 transition flex items-center gap-3">
                                <ChevronLeft className="w-5 h-5 text-[#ff6b00] shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-xs font-mono text-[#8a857d]">
                                        Previous Project
                                    </div>
                                    <div className="text-sm font-semibold text-[#f0ece4] truncate">
                                        {prevProject.title}
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextProject && (
                            <Link
                                to={`/projects/${nextProject.id}`}
                                className="rounded-xl border border-[#1f1f1f] bg-[#111111] p-4 hover:border-[#ff6b00]/50 transition flex items-center justify-end gap-3 text-right">
                                <div className="min-w-0">
                                    <div className="text-xs font-mono text-[#8a857d]">
                                        Next Project
                                    </div>
                                    <div className="text-sm font-semibold text-[#f0ece4] truncate">
                                        {nextProject.title}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-[#ff6b00] shrink-0" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
