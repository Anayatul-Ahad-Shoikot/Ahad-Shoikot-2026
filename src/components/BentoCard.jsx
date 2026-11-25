import { useRef, useCallback } from "react";

export default function BentoCard({
    children,
    className = "",
    onClick,
    style = {},
    delay = 0,
}) {
    const glowRef = useRef(null);

    const handleMove = useCallback((e) => {
        if (!glowRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        glowRef.current.style.left = `${e.clientX - rect.left}px`;
        glowRef.current.style.top = `${e.clientY - rect.top}px`;
    }, []);

    return (
        <div
            className={`fade-in ${className} h-full`}
            style={{ animationDelay: `${delay}ms` }}>
            <div
                className="bento-card h-full"
                style={style}
                onMouseMove={handleMove}
                onClick={onClick}>
                <div ref={glowRef} className="card-glow" />
                <div className="card-content h-full">{children}</div>
            </div>
        </div>
    );
}
