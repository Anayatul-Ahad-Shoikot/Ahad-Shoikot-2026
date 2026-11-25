import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import { usePortfolio } from "../context/PortfolioContext";
import { Link } from "react-router-dom";

export default function ExperiencePage() {
    const { portfolio: PORTFOLIO } = usePortfolio();
    return (
        <div className="w-full flex-1 flex flex-col page-transition-enter">
            <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="flex flex-col items-center justify-center">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">Experience</h1>
                    <p className="page-subtitle">Professional journey so far</p>
                </div>
                {/* ── Role Cards ── */}
                {PORTFOLIO.experience.map((exp, i) => {
                    const isCurrent = exp.period
                        ?.toLowerCase()
                        .includes("present");
                    return (
                        <BentoCard key={i} delay={i * 100}>
                            <div className="exp-card-inner">
                                {/* Header */}
                                <div className="exp-header">
                                    <div className="exp-header-top">
                                        <span className="exp-index">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        {isCurrent && (
                                            <div className="exp-current-badge">
                                                <span className="exp-current-dot" />
                                                Current
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="card-title break-words">
                                        {exp.role}
                                    </h3>
                                    <div className="exp-company-row">
                                        <span className="exp-company">
                                            {exp.company}
                                        </span>
                                        <span className="exp-period">
                                            {exp.period}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="exp-desc">{exp.desc}</p>
                            </div>
                        </BentoCard>
                    );
                })}

                {/* ── Stat Cards ── */}
                <BentoCard delay={400}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            textAlign: "center",
                        }}>
                        <div className="stat-number">1 Year +</div>
                        <div className="stat-label">Years of Experience</div>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
}
