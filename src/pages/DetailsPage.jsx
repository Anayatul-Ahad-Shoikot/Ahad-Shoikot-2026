import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import PORTFOLIO from "../data/portfolio";
import { Link } from "react-router-dom";

export default function DetailsPage() {
    return (
        <div className="w-full h-full page-transition-enter">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="flex flex-col items-center justify-center">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">About Me</h1>
                    <p className="page-subtitle">The story behind the code</p>
                </div>

                <BentoCard className="md:col-span-2" delay={0}>
                    <div className="card-label">Bio</div>
                    <div className="card-title">
                        CSE graduate & Frontend Developer
                    </div>
                    <div className="card-desc">{PORTFOLIO.bio}</div>
                </BentoCard>

                <BentoCard className="md:row-span-2" delay={120}>
                    <div className="card-label">Education</div>
                    <div className="card-title">Academic Journey</div>
                    <div className="edu-bento">
                        <div className="edu-timeline">
                            {PORTFOLIO.education.map((edu, idx) => (
                                <div key={idx} className="edu-item">
                                    <div className="edu-rail">
                                        <div className="edu-node" />
                                        <div className="edu-connector" />
                                    </div>
                                    <div className="edu-content">
                                        <div className="edu-content-top">
                                            <h3 className="edu-degree">
                                                {edu.degree}
                                            </h3>
                                            <span className="edu-tag">
                                                {edu.tag}
                                            </span>
                                        </div>
                                        <div className="edu-meta">
                                            <span className="edu-year">
                                                {edu.year}
                                            </span>
                                            <span className="edu-sep" />
                                            <span className="edu-institution">
                                                {edu.institution}
                                            </span>
                                        </div>
                                        <div className="edu-grade">
                                            {edu.grade}
                                            {edu.gradeNote && (
                                                <span className="edu-grade-note">
                                                    ({edu.gradeNote})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

                <BentoCard
                    className="md:col-span-2"
                    delay={240}
                    style={{ gridColumn: "span 2" }}>
                    <div className="card-label">Tech Stack</div>
                    <div className="card-title">Skills & Tools</div>
                    <div className="skills-grid">
                        {PORTFOLIO.skills.map((s) => (
                            <span key={s} className="skill-pill">
                                {s}
                            </span>
                        ))}
                    </div>
                </BentoCard>

                <BentoCard className="" delay={360}>
                    <div className="pd-bento">
                        <div className="pd-header">
                            <div className="card-label">Details</div>
                            <h2 className="card-title">Get to Know Me</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="pd-about-item">
                                <div className="pd-about-key">Birthday</div>
                                <div className="pd-about-value">
                                    {PORTFOLIO.birthday.date}
                                </div>
                            </div>
                            <div className="pd-about-item">
                                <div className="pd-about-key">Age</div>
                                <div className="pd-about-value">
                                    <span className="pd-about-value-accent">
                                        {PORTFOLIO.birthday.age}
                                    </span>
                                    yrs
                                </div>
                            </div>
                            <div className="pd-about-item pd-about-item-wide">
                                <div className="pd-about-key">Based In</div>
                                <div className="pd-about-value">
                                    Dhaka, Bangladesh
                                </div>
                            </div>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
}
