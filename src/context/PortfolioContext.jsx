import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import STATIC_PORTFOLIO from "../data/portfolio";
import { isSupabaseConfigured } from "../lib/supabase";
import { fetchAllPortfolioData, slugify } from "../services/portfolioService";

const fallbackPortfolio = {
    ...STATIC_PORTFOLIO,
    acceptingProjects: true,
    avatarUrl: null,
    certificates: [],
    skillRows: STATIC_PORTFOLIO.skills.map((name, i) => ({
        id: i + 1,
        name,
        sort_order: i + 1,
    })),
    projects: STATIC_PORTFOLIO.projects.map((p) => ({
        ...p,
        slug: slugify(p.title),
        longDescription: "",
    })),
};

const PortfolioContext = createContext({
    portfolio: fallbackPortfolio,
    loading: false,
    error: null,
    isUsingDatabase: false,
    refresh: async () => {},
});

export function PortfolioProvider({ children }) {
    const [portfolio, setPortfolio] = useState(fallbackPortfolio);
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [error, setError] = useState(null);
    const [isUsingDatabase, setIsUsingDatabase] = useState(false);

    const refresh = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setPortfolio(fallbackPortfolio);
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
            console.warn(
                "Falling back to static portfolio data:",
                err?.message || err,
            );
            setError(err?.message || "Failed to load database");
            setPortfolio(fallbackPortfolio);
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
