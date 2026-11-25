import Particles from "./components/Particles";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import InterestsPage from "./pages/InterestsPage";
import DetailsPage from "./pages/DetailsPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import TrainingPage from "./pages/TrainingPage";
import AdminPage from "./pages/AdminPage";
import BackArrow from "./components/BackArrow";
import { PortfolioProvider } from "./context/PortfolioContext";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function NotFoundPage() {
    return (
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center page-transition-enter">
            <h1 className="page-title">404</h1>
            <p className="page-subtitle mb-6">Page not found</p>
            <Link to="/" className="back-btn">
                <BackArrow /> Back Home
            </Link>
        </div>
    );
}

export default function App() {
    return (
        <PortfolioProvider>
            <div className="w-full min-h-screen flex flex-col p-3 sm:p-6 md:p-8 xl:p-10">
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
                        <Route
                            path="/projects/:id"
                            element={<ProjectDetailsPage />}
                        />
                        <Route path="/experience" element={<ExperiencePage />} />
                        <Route path="/details" element={<DetailsPage />} />
                        <Route path="/interests" element={<InterestsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/training" element={<TrainingPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </PortfolioProvider>
    );
}
