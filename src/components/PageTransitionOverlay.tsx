import React, { useEffect } from 'react';
import styles from './PageTransitionOverlay.module.css';
import { useReducedMotion } from 'framer-motion';
import { ANIMATION_SETTINGS } from '../animations/settings';

export type TransitionPhase = 'IDLE' | 'IN' | 'HOLD' | 'OUT';
export type TransitionMode = 'FOCUS' | 'FLUID';

interface PageTransitionOverlayProps {
    phase: TransitionPhase;
    mode: TransitionMode;
    onMiddlePointReached?: () => void;
    onComplete?: () => void;
}

const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({ phase, mode, onMiddlePointReached, onComplete }) => {
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (phase === 'IN') {
            const duration = mode === 'FLUID'
                ? ANIMATION_SETTINGS.transitions.fluid.coverDuration
                : ANIMATION_SETTINGS.transitions.focus.blurDuration;

            const timer = setTimeout(() => {
                if (onMiddlePointReached) onMiddlePointReached();
            }, duration * 1000);
            return () => clearTimeout(timer);
        } else if (phase === 'OUT') {
            const duration = mode === 'FLUID'
                ? ANIMATION_SETTINGS.transitions.fluid.revealDuration
                : ANIMATION_SETTINGS.transitions.focus.blurDuration; // Symmetric out

            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, duration * 1000);
            return () => clearTimeout(timer);
        }
    }, [phase, mode, onMiddlePointReached, onComplete]);

    if (phase === 'IDLE') return null;

    // Reduced Motion Fallback (Fade)
    if (prefersReducedMotion) {
        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'black', zIndex: 9999, transition: 'opacity 0.3s',
                opacity: phase === 'IN' || phase === 'HOLD' ? 1 : 0,
                pointerEvents: 'none'
            }} />
        );
    }

    /* === FLUID MODE === */
    if (mode === 'FLUID') {
        return (
            <div className={styles.overlayContainer}>
                <div className={`${styles.liquidLayer} ${phase === 'IN' || phase === 'HOLD' ? styles.animatingIn : styles.animatingOut}`}>
                    {/* Visuals inside the liquid */}
                    <div className={styles.waveEdge} />

                    {/* Random Bubbles */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className={styles.bubble} style={{
                            left: `${Math.random() * 100}%`,
                            width: `${15 + Math.random() * 30}px`,
                            height: `${15 + Math.random() * 30}px`,
                            '--rise-duration': `${1.5 + Math.random() * 2}s`
                        } as React.CSSProperties} />
                    ))}
                </div>
            </div>
        );
    }

    /* === FOCUS MODE === */
    return (
        <div className={styles.focusContainer} style={{
            opacity: phase === 'IN' || phase === 'HOLD' ? 1 : 0,
        }}>
            {/* Blurry Backdrop */}
            <div className={styles.focusBackdrop} />

            {/* Focus Ring */}
            <div className={`${styles.focusRing} ${phase === 'IN' || phase === 'HOLD' ? styles.ringIn : styles.ringOut}`} />
        </div>
    );
};

export default PageTransitionOverlay;
