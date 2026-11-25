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
        <div className="w-full flex-1 flex flex-col gap-5 page-transition-enter">
            {/* Top Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Link to="/projects" className="back-btn">
                    <BackArrow /> Back to Projects
                </Link>
                <div className="flex items-center gap-2 text-xs font-mono text-[#8a857d]">
                    <span className="px-3 py-1 rounded-full border border-[#1f1f1f] bg-[#111111]">
                        {project.category}
                    </span>
                    <span className="px-3 py-1 rounded-full border border-[#1f1f1f] bg-[#111111]">
                        {project.year}
                    </span>
                    {project.featured && (
                        <span className="px-3 py-1 rounded-full border border-[#ff6b00]/40 bg-[#ff6b00]/10 text-[#ff6b00] inline-flex items-center gap-1.5">
                            <Star className="w-3 h-3 fill-[#ff6b00]" />
                            Work in progress
                        </span>
                    )}
                </div>
            </div>

            {/* Main Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Image Gallery */}
                <BentoCard className="lg:col-span-2" delay={0}>
                    {images.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#1f1f1f] bg-[#0a0a0a]">
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
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextImg}
                                            aria-label="Next image"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-white/10 text-white hover:border-[#ff6b00] hover:text-[#ff6b00] transition cursor-pointer">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/70 text-xs font-mono text-[#f0ece4] border border-white/10">
                                            {activeImg + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {images.map((src, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() =>
                                                setImgSelection({ id, index: i })
                                            }
                                            className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border transition cursor-pointer ${
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
                        <div className="w-full aspect-video rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] flex items-center justify-center text-[#8a857d] text-sm">
                            No preview images available
                        </div>
                    )}
                </BentoCard>

                {/* Project Info Sidebar */}
                <BentoCard delay={100}>
                    <div className="flex flex-col h-full gap-5">
                        <div>
                            <div className="card-label">Project Details</div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#f0ece4] mt-1">
                                {project.title}
                            </h1>
                        </div>

                        <div className="flex flex-col gap-3 text-sm text-[#8a857d] border-y border-[#1f1f1f] py-4">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-[#ff6b00]" />
                                    Category
                                </span>
                                <span className="text-[#f0ece4] font-medium">
                                    {project.category}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#ff6b00]" />
                                    Year
                                </span>
                                <span className="text-[#f0ece4] font-medium">
                                    {project.year}
                                </span>
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

                        <div className="mt-auto flex flex-col gap-2.5 pt-4">
                            {project.live && project.live !== "#" && (
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="proj-link proj-link-primary justify-center py-2.5">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Live Preview</span>
                                </a>
                            )}
                            {project.github && project.github !== "#" && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="proj-link proj-link-ghost justify-center py-2.5">
                                    <GithubIcon />
                                    <span>View Source on GitHub</span>
                                </a>
                            )}
                        </div>
                    </div>
                </BentoCard>

                {/* Description */}
                <BentoCard className="lg:col-span-3" delay={180}>
                    <div className="card-label">About This Project</div>
                    <h2 className="card-title mb-3">Overview</h2>
                    <p className="text-[#f0ece4]/90 leading-relaxed whitespace-pre-line">
                        {project.description}
                    </p>
                    {project.longDescription && (
                        <div className="mt-5 pt-5 border-t border-[#1f1f1f]">
                            <h3 className="text-sm font-mono uppercase tracking-wider text-[#ff6b00] mb-2">
                                Case Study & Implementation
                            </h3>
                            <p className="text-[#8a857d] leading-relaxed whitespace-pre-line">
                                {project.longDescription}
                            </p>
                        </div>
                    )}
                </BentoCard>
            </div>

            {/* Next / Previous Project Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevProject ? (
                    <Link
                        to={`/projects/${prevProject.id}`}
                        className="rounded-2xl border border-[#1f1f1f] bg-[#111111] p-4 hover:border-[#ff6b00]/50 transition flex items-center gap-3">
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
                        className="rounded-2xl border border-[#1f1f1f] bg-[#111111] p-4 hover:border-[#ff6b00]/50 transition flex items-center justify-end gap-3 text-right">
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
        </div>
    );
}
