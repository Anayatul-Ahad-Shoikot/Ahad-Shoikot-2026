import BentoCard from "../components/BentoCard";
import ArrowIcon from "../components/ArrowIcon";
import PORTFOLIO from "../data/portfolio";
import { Link } from "react-router-dom";

export default function HomePage() {
    const iconClass =
        "w-5 h-5 stroke-[#ff6b00] group-hover:stroke-white transition-colors duration-300";

    const wrapperClass =
        "p-3 rounded-full border border-[#ff6b00]/40 hover:border-[#ff6b00] transition";
    return (
        <div className="w-full h-full page-transition-enter">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <BentoCard className="sm:col-span-2 sm:row-span-2" delay={0}>
                    <div className="card-label">Portfolio 2026</div>
                    <h1 className="hero-name">{PORTFOLIO.name}</h1>
                    <p className="hero-role">{PORTFOLIO.title}</p>
                    <p className="hero-tagline">{PORTFOLIO.tagline}</p>
                    <div className="status-indicator justify-end md:pr-5">
                        <div className="flex items-end gap-4">
                            <a
                                href="https://github.com/Anayatul-Ahad-Shoikot"
                                target="_blank"
                                rel="noreferrer"
                                className="group">
                                <div className={wrapperClass}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className={iconClass}
                                        strokeWidth="1">
                                        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.66-.22.66-.49 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.63.07-.63 1 .07 1.52 1.05 1.52 1.05.89 1.57 2.34 1.12 2.9.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.84c.85.004 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.44.11 2.7.64.71 1.02 1.62 1.02 2.74 0 3.95-2.34 4.82-4.57 5.08.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.16.6.67.49A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z" />
                                    </svg>
                                </div>
                            </a>
                            <a
                                href="https://www.facebook.com/ahadshoikot"
                                target="_blank"
                                rel="noreferrer"
                                className="group">
                                <div className={wrapperClass}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className={iconClass}
                                        strokeWidth="1">
                                        <path d="M15 3h-2a4 4 0 00-4 4v2H7v3h2v7h3v-7h2.5l.5-3H12V7a1 1 0 011-1h2V3z" />
                                    </svg>
                                </div>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/anayatul-ahad-shoikot"
                                target="_blank"
                                rel="noreferrer"
                                className="group">
                                <div className={wrapperClass}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className={iconClass}
                                        strokeWidth="1">
                                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                                        <rect
                                            x="2"
                                            y="9"
                                            width="4"
                                            height="12"
                                            rx="1"
                                        />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                </div>
                            </a>
                            <a
                                href="https://www.instagram.com/__shoi____kot__"
                                target="_blank"
                                rel="noreferrer"
                                className="group">
                                <div className={wrapperClass}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className={iconClass}
                                        strokeWidth="1">
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="5"
                                        />
                                        <circle cx="12" cy="12" r="4" />
                                        <circle cx="17" cy="7" r="1" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </BentoCard>

                <Link to="/projects">
                    <BentoCard delay={100}>
                        <div className="card-label">⬡ Projects</div>
                        <div className="card-title text-2xl md:text-3xl lg:text-4xl text-white/50 italic w-full">
                            Projects
                        </div>
                        <div className="card-desc">
                            Things I've built & shipped
                        </div>
                        <div className="w-full h-full flex items-end justify-end mt-2">
                            <ArrowIcon />
                        </div>
                    </BentoCard>
                </Link>

                <Link to="/experience">
                    <BentoCard delay={200}>
                        <div className="card-label">⬡ Experience</div>
                        <div className="card-title text-2xl md:text-3xl lg:text-4xl text-white/50 italic w-full">
                            Experience
                        </div>
                        <div className="card-desc">Professional journey</div>
                        <div className="w-full h-full flex items-end justify-end mt-2">
                            <ArrowIcon />
                        </div>
                    </BentoCard>
                </Link>

                <Link to="/details" className="sm:row-span-2">
                    <BentoCard
                        delay={300}
                        style={{
                            border: "2px solid rgba(255, 107, 0, 0.7)",
                            boxShadow:
                                "0 0px 10px rgba(255, 107, 0, 0.8), inset 0 0 15px rgba(255, 107, 0, 0.6)",
                        }}>
                        <div className="card-label">△ About Me</div>
                        <div className="card-title text-2xl md:text-3xl lg:text-4xl text-white/50 italic w-full">
                            About Me
                        </div>
                        <div className="card-desc">
                            Bio, Skills & Educations
                        </div>
                        <div className="w-full h-full flex items-end justify-end mt-2">
                            <ArrowIcon />
                        </div>
                    </BentoCard>
                </Link>

                <Link to="/interests">
                    <BentoCard delay={400}>
                        <div className="card-label">◉ Interests</div>
                        <div className="card-title text-2xl md:text-3xl lg:text-4xl text-white/50 italic w-full">
                            Interests
                        </div>
                        <div className="card-desc">
                            What I love, what drives my curiosity
                        </div>
                        <div className="w-full h-full flex items-end justify-end mt-2">
                            <ArrowIcon />
                        </div>
                    </BentoCard>
                </Link>

                <Link to="/contact">
                    <BentoCard delay={500}>
                        <div className="card-label">◇ Contact</div>
                        <div className="card-title text-2xl md:text-3xl lg:text-4xl text-white/50 italic w-full">
                            Contact
                        </div>
                        <div className="card-desc">Let's build together</div>
                        <div className="w-full h-full flex items-end justify-end mt-2">
                            <ArrowIcon />
                        </div>
                    </BentoCard>
                </Link>

                <Link to="/training">
                    <BentoCard delay={500}>
                        <div className="card-label">◇ Trainning & Courses</div>
                        <div className="card-title text-2xl md:text-3xl lg:text-4xl text-white/50 italic w-full">
                            Trainning & Courses
                        </div>
                        <div className="card-desc">Let's build together</div>
                        <div className="w-full h-full flex items-end justify-end mt-2">
                            <ArrowIcon />
                        </div>
                    </BentoCard>
                </Link>

                <BentoCard delay={600}>
                    <div className="avatar-visual">
                        <div className="avatar-orbit">
                            <div className="avatar-orbit-dot" />
                        </div>
                        <div className="avatar-ring">
                            <span className="avatar-initials">
                                {PORTFOLIO.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </span>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
}
