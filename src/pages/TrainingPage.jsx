import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import { usePortfolio } from "../context/PortfolioContext";
import { Link } from "react-router-dom";
import { Award, ExternalLink } from "lucide-react";

export default function TrainingPage() {
    const { portfolio: PORTFOLIO } = usePortfolio();
    const certificates = PORTFOLIO.certificates || [];

    return (
        <div className="w-full flex-1 flex flex-col page-transition-enter">
            <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="flex flex-col items-center justify-center">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">Training & Courses</h1>
                    <p className="page-subtitle">
                        Certifications, courses & languages
                    </p>
                </div>

                <BentoCard className="sm:col-span-2" delay={0}>
                    <div className="pd-bento">
                        <div className="pd-header">
                            <div className="card-label">Certifications</div>
                            <h2 className="card-title">Courses & Training</h2>
                        </div>
                        <div className="pd-course-list">
                            {PORTFOLIO.courses.map((course, idx) => (
                                <div key={idx} className="pd-course-item">
                                    <div className="pd-course-left">
                                        <div className="pd-course-name">
                                            {course.name}
                                        </div>
                                        <div className="pd-course-platform">
                                            {course.platform}
                                        </div>
                                    </div>
                                    <span className="pd-course-year">
                                        {course.year}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

                <BentoCard className="sm:col-span-2 md:col-span-3 lg:col-span-1" delay={140}>
                    <div className="pd-bento">
                        <div className="pd-header">
                            <div className="card-label">Communication</div>
                            <h2 className="card-title">Languages</h2>
                        </div>
                        <div className="pd-lang-list">
                            {PORTFOLIO.languages.map((lang, idx) => (
                                <div key={idx} className="pd-lang-item">
                                    <div className="pd-lang-top">
                                        <span className="pd-lang-name">
                                            {lang.name}
                                        </span>
                                        <span className="pd-lang-level">
                                            {lang.level}
                                        </span>
                                    </div>
                                    <div className="pd-lang-bar-track">
                                        <div
                                            className="pd-lang-bar-fill"
                                            style={{
                                                width: `${lang.proficiency}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

                <BentoCard className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4" delay={240}>
                    <div className="pd-bento">
                        <div className="pd-header">
                            <div className="card-label">Verified Credentials</div>
                            <h2 className="card-title">Certificates</h2>
                        </div>
                        {certificates.length === 0 ? (
                            <p className="text-sm text-[#8a857d]">
                                No certificates added yet. Add certificates from the{" "}
                                <Link to="/admin" className="text-[#ff6b00] underline">
                                    Admin Panel
                                </Link>
                                .
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {certificates.map((cert, idx) => (
                                    <div
                                        key={cert.id || idx}
                                        className="rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] p-4 flex flex-col gap-3 hover:border-[#ff6b00]/40 transition">
                                        {cert.imageUrl && (
                                            <div className="w-full h-40 rounded-lg overflow-hidden border border-[#1f1f1f] bg-black/40">
                                                <img
                                                    src={cert.imageUrl}
                                                    alt={cert.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 text-[#f0ece4] font-semibold">
                                                    <Award className="w-4 h-4 text-[#ff6b00] shrink-0" />
                                                    <span>{cert.title}</span>
                                                </div>
                                                <div className="text-xs text-[#8a857d] mt-1">
                                                    {cert.issuer} · {cert.issueDate}
                                                </div>
                                            </div>
                                        </div>
                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-auto inline-flex items-center gap-1.5 text-xs text-[#ff6b00] hover:underline">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                View Credential
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </BentoCard>
            </div>
        </div>
    );
}
