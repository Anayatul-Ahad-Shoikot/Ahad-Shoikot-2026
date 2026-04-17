import BentoCard from "../components/BentoCard";
import BackArrow from "../components/BackArrow";
import PORTFOLIO from "../data/portfolio";
import { Link } from "react-router-dom";

export default function InterestsPage() {

    return (
        <div className="w-full h-full page-transition-enter">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <div className="flex flex-col items-center justify-center">
                    <Link to="/" className="back-btn">
                        <BackArrow /> Back
                    </Link>
                    <h1 className="page-title">Interests</h1>
                    <p className="page-subtitle">
                        What fuels the creative engine
                    </p>
                </div>

                {PORTFOLIO.interests.map((item, i) => (
                    <BentoCard key={i} className="interest-card" delay={i * 70}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                padding: "10px 0",
                            }}>
                            <span className="interest-icon">{item.icon}</span>
                            <div className="interest-label">{item.label}</div>
                            <div className="interest-desc">{item.desc}</div>
                        </div>
                    </BentoCard>
                ))}
            </div>
        </div>
    );
}
