// ═══════════════════════════════════════════════════════════════
// use3DTilt.js — Mouse-tracking 3D perspective tilt + glow
// ═══════════════════════════════════════════════════════════════

import { useRef, useCallback } from "react";

export default function use3DTilt(intensity = 8) {
    const ref = useRef(null);
    const glowRef = useRef(null);

    const handleMove = useCallback(
        (e) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -intensity;
            const rotateY = ((x - centerX) / centerX) * intensity;

            ref.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            if (glowRef.current) {
                glowRef.current.style.left = `${x}px`;
                glowRef.current.style.top = `${y}px`;
            }
        },
        [intensity]
    );

    const handleLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform =
            "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }, []);

    return { ref, glowRef, handleMove, handleLeave };
}