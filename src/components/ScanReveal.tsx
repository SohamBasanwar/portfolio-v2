import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASINGS } from '../animations/settings';

interface ScanRevealProps {
    children: React.ReactNode;
    label?: string; // Optional "Specimen: XYZ" label
    delay?: number;
    className?: string;
}

const ScanReveal: React.FC<ScanRevealProps> = ({ children, label, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const prefersReducedMotion = useReducedMotion();

    // Reduced Motion: Simple Fade
    if (prefersReducedMotion) {
        return (
            <div ref={ref} className={className} style={{
                opacity: isInView ? 1 : 0,
                transition: 'opacity 0.5s ease',
                transitionDelay: `${delay}s`
            }}>
                {children}
            </div>
        );
    }

    return (
        <div ref={ref} className={`scan-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Content Animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASINGS.biotech as any, delay: delay }}
            >
                {children}
            </motion.div>

            {/* Scan Line Animation */}
            {isInView && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'var(--color-primary-cyan)',
                        boxShadow: '0 0 10px var(--color-primary-cyan), 0 0 20px var(--color-primary-cyan)',
                        zIndex: 10,
                        opacity: 0,
                    }}
                    initial={{ top: '-10%', opacity: 0 }}
                    animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, ease: "linear", delay: delay }}
                />
            )}

            {/* Optional Specimen Label */}
            {label && isInView && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: 'var(--color-primary-cyan)',
                        padding: '2px 6px',
                        background: 'rgba(0, 20, 20, 0.8)',
                        borderBottomLeftRadius: '4px',
                        pointerEvents: 'none'
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 0.7, x: 0 }}
                    transition={{ delay: delay + 0.5, duration: 0.5 }}
                >
                    SPECIMEN: {label}
                </motion.div>
            )}
        </div>
    );
};

export default ScanReveal;
