import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './CapabilitiesCylinder.module.css';
import { useReducedMotion } from 'framer-motion';

interface Skill {
    name: string;
    type: string;
    icon: React.ComponentType<any>;
}

interface CapabilitiesCylinderProps {
    skills: Skill[];
}

const CapabilitiesCylinder: React.FC<CapabilitiesCylinderProps> = ({ skills }) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    // State
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [radius, setRadius] = useState(250);

    // Physics constants
    const AUTO_SPEED = 0.08; // Slower rotation
    const DRAG_FACTOR = 0.5;
    const MOMENTUM_DAMPING = 0.95;

    // Refs for physics loop
    const momentumRef = useRef(0);
    const lastClientXRef = useRef(0);
    const rafRef = useRef<number>(0);
    const isPausedRef = useRef(false);

    // 3D Config
    const TAG_COUNT = skills.length;
    const ANGLE_STEP = 360 / TAG_COUNT;

    // Responsive Radius calculation
    useEffect(() => {
        const handleResize = () => {
            // Target ~60% screen width for diameter => ~30% for radius
            const targetRadius = window.innerWidth * 0.30;
            // Clamps: Min 120px (mobile), Max 500px 
            setRadius(Math.max(120, Math.min(500, targetRadius)));
        };

        handleResize(); // Initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Physics Loop ---
    const update = useCallback(() => {
        if (!isDragging && !isPausedRef.current && !hoveredIndex) {
            // Apply Momentum or Auto-Rotation
            if (Math.abs(momentumRef.current) > 0.01) {
                setRotation(r => r + momentumRef.current);
                momentumRef.current *= MOMENTUM_DAMPING;
            } else if (!prefersReducedMotion) {
                setRotation(r => r - AUTO_SPEED); // Rotate left by default
            }
        }
        rafRef.current = requestAnimationFrame(update);
    }, [isDragging, hoveredIndex, prefersReducedMotion]);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafRef.current);
    }, [update]);

    // --- Interaction Handlers ---
    const handlePointerDown = (e: React.PointerEvent) => {
        if (prefersReducedMotion && e.pointerType === 'mouse') return; // Allow manual only if enabled or intended

        setIsDragging(true);
        lastClientXRef.current = e.clientX;
        momentumRef.current = 0; // Stop momentum on grab
        containerRef.current?.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const delta = e.clientX - lastClientXRef.current;
        lastClientXRef.current = e.clientX;

        const rotateDelta = delta * DRAG_FACTOR;
        setRotation(r => r + rotateDelta);

        // Track momentum
        momentumRef.current = rotateDelta;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        containerRef.current?.releasePointerCapture(e.pointerId);
    };

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
        isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        isPausedRef.current = false;
    };

    // --- Keyboard Control (Accessibility) ---
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') setRotation(r => r + 20);
        if (e.key === 'ArrowRight') setRotation(r => r - 20);
    };

    return (
        <div
            className={styles.viewport}
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp} // Safety release
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Rotating capabilities tag cloud"
        >
            <div className={styles.cylinder} style={{ transform: `rotateY(${rotation}deg)` }}>
                {skills.map((skill, index) => {
                    // Calculate "Frontness" (0 to 1)
                    // The tag's angle in the cylinder:
                    const itemAngle = index * ANGLE_STEP;
                    // Current global rotation:
                    const currentAngle = (itemAngle + rotation) % 360;
                    // Standardize to -180...180 range
                    const normalizedAngle = ((currentAngle + 180) % 360 + 360) % 360 - 180;

                    // Cosine falloff: 1 at center (0deg), 0 at back (180deg)
                    // We map distance from 0. 
                    // If dist is 0 -> 1. If dist is 180 -> -1.
                    const radians = (normalizedAngle * Math.PI) / 180;
                    const cosVal = Math.cos(radians); // 1 (front) to -1 (back)

                    // Map to visual properties
                    const isFront = cosVal > 0;
                    const opacity = isFront ? 0.3 + 0.7 * cosVal : 0.1; // Dim back side
                    const scale = isFront ? 0.8 + 0.4 * cosVal : 0.8;
                    const blur = isFront ? 0 : '2px';

                    // If hovered, force full visibility on that one
                    const isHovered = hoveredIndex === index;
                    const anyHovered = hoveredIndex !== null;

                    let finalOpacity = isHovered ? 1 : opacity;
                    let finalScale = isHovered ? 1.2 : scale;

                    // Depth Spotlight: Dim others if one is focused
                    if (anyHovered && !isHovered) {
                        finalOpacity = finalOpacity * 0.2; // Strong dim
                        // blur is already handled by 'blur' variable based on frontness, 
                        // but we might want to blur background ones even more?
                        // For now, opacity is enough.
                    }

                    return (
                        <div
                            key={skill.name}
                            className={`${styles.tag} ${isHovered ? styles.tagFocused : ''}`}
                            style={{
                                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${finalScale})`,
                                opacity: finalOpacity,
                                filter: `blur(${!isHovered ? blur : '0px'})`,
                                backgroundColor: isFront ? undefined : 'rgba(0,0,0,0.5)',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span className={styles.labelType} style={{ color: isHovered ? 'var(--color-accent-acid)' : undefined }}>
                                {skill.type}
                            </span>

                            {/* Icon - Neo Green / Acid Color */}
                            <skill.icon size={32} style={{ color: 'var(--color-accent-acid)', filter: 'drop-shadow(0 0 5px var(--color-accent-acid))' }} />

                            <span style={{ fontWeight: 'bold' }}>{skill.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CapabilitiesCylinder;
