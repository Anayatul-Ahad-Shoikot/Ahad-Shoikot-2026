import Particles from "./components/Particles";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import InterestsPage from "./pages/InterestsPage";
import DetailsPage from "./pages/DetailsPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export default function App() {
    return (
        <div className="w-screen h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 xl:p-10">
            <BrowserRouter>
                <ScrollToTop />
                <div className="noise-overlay" />
                <div className="grid-bg" />
                <div className="ambient-glow" />
                <div className="ambient-glow-2" />
                <Particles />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/details" element={<DetailsPage />} />
                    <Route path="/interests" element={<InterestsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
