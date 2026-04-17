import use3DTilt from "../hooks/use3DTilt";

export default function BentoCard({
    children,
    className = "",
    onClick,
    style = {},
    delay = 0,
}) {
    const { ref, glowRef, handleMove, handleLeave } = use3DTilt(6);

    return (
        <div className={`fade-in ${className} h-full`} style={{ animationDelay: `${delay}ms` }}>
            <div
                ref={ref}
                className="bento-card h-full"
                style={style}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                onClick={onClick}>
                <div ref={glowRef} className="card-glow" />
                <div className="card-content h-full">{children}</div>
            </div>
        </div>
    );
}
