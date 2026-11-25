import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { isSupabaseConfigured } from "../lib/supabase";
import { fetchAllPortfolioData } from "../services/portfolioService";

const emptyPortfolio = {
    name: "",
    title: "",
    tagline: "",
    email: "",
    location: "",
    bio: "",
    birthday: { date: "", age: 0 },
    acceptingProjects: true,
    avatarUrl: null,
    social: {},
    skills: [],
    skillRows: [],
    projects: [],
    experience: [],
    education: [],
    interests: [],
    courses: [],
    certificates: [],
    languages: [],
};

const PortfolioContext = createContext({
    portfolio: emptyPortfolio,
    loading: false,
    error: null,
    isUsingDatabase: false,
    refresh: async () => {},
});

export function PortfolioProvider({ children }) {
    const [portfolio, setPortfolio] = useState(emptyPortfolio);
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [error, setError] = useState(null);
    const [isUsingDatabase, setIsUsingDatabase] = useState(false);

    const refresh = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setPortfolio(emptyPortfolio);
            setIsUsingDatabase(false);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const dbData = await fetchAllPortfolioData();
            setPortfolio(dbData);
            setIsUsingDatabase(true);
        } catch (err) {
            console.error(
                "Failed to load portfolio data from Supabase:",
                err?.message || err,
            );
            setError(err?.message || "Failed to load database");
            setIsUsingDatabase(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <PortfolioContext.Provider
            value={{ portfolio, loading, error, isUsingDatabase, refresh }}>
            {children}
        </PortfolioContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio() {
    return useContext(PortfolioContext);
}
