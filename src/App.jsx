import Particles from "./components/Particles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import InterestsPage from "./pages/InterestsPage";
import DetailsPage from "./pages/DetailsPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
    return (
        <div className="w-screen h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 xl:p-10">
            <BrowserRouter>
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
