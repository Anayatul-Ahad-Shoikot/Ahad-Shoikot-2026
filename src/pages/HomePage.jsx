import BentoCard from "../components/BentoCard";
import ArrowIcon from "../components/ArrowIcon";
import PORTFOLIO from "../data/portfolio";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="w-full h-full page-transition-enter">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <BentoCard className="sm:col-span-2 sm:row-span-2" delay={0}>
                    <div className="card-label">Portfolio 2026</div>
                    <h1 className="hero-name">{PORTFOLIO.name}</h1>
                    <p className="hero-role">{PORTFOLIO.title}</p>
                    <p className="hero-tagline">{PORTFOLIO.tagline}</p>
                    <div className="status-indicator">
                        <span className="status-dot" />
                        Available for projects
                    </div>
                </BentoCard>

                <Link to="/projects">
                    <BentoCard delay={100}>
                        <div className="card-label">⬡ Projects</div>
                        <div className="card-title text-5xl text-white/50 italic">
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
                        <div className="card-title text-5xl text-white/50 italic">
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
                        <div className="card-title text-5xl text-white/50 italic">
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
                        <div className="card-title text-5xl text-white/50 italic">
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
                        <div className="card-title text-5xl text-white/50 italic">
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
                        <div className="card-title text-5xl text-white/50 italic">
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
