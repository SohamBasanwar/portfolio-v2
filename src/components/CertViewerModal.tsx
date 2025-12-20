import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaTimes, FaSearchPlus, FaSearchMinus, FaUndo } from 'react-icons/fa';

interface CertViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    title: string;
    originRect?: DOMRect | null;
}

const CertViewerModal: React.FC<CertViewerModalProps> = ({ isOpen, onClose, imageSrc, title, originRect }) => {
    const prefersReducedMotion = useReducedMotion();

    // Zoom & Pan State
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);

    // Refs for drag physics
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset loop
    useEffect(() => {
        if (!isOpen) {
            setScale(1);
        }
    }, [isOpen]);

    // Keyboard (ESC)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Zoom Logic
    const handleZoom = (delta: number) => {
        setScale(prev => Math.min(Math.max(1, prev + delta), 5)); // Clamp 1x to 5x
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        handleZoom(e.deltaY * -0.005);
    };

    // Prepare Animation Variants
    // Calculate center of origin rect for the circle start point
    const originX = originRect ? originRect.left + originRect.width / 2 : window.innerWidth / 2;
    const originY = originRect ? originRect.top + originRect.height / 2 : window.innerHeight / 2;

    const modalVariants = {
        hidden: {
            opacity: 0,
            clipPath: prefersReducedMotion
                ? 'inset(0 0 0 0)' // Just fade if reduced motion
                : `circle(0px at ${originX}px ${originY}px)`,
            backgroundColor: 'rgba(0,0,0,0)'
        },
        visible: {
            opacity: 1,
            clipPath: prefersReducedMotion
                ? 'inset(0 0 0 0)'
                : `circle(150% at 50% 50%)`, // Expand to full screen
            backgroundColor: 'rgba(0, 10, 15, 0.95)',
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }
        },
        exit: {
            opacity: 0,
            clipPath: prefersReducedMotion
                ? 'inset(0 0 0 0)'
                : `circle(0px at ${originX}px ${originY}px)`,
            backgroundColor: 'rgba(0,0,0,0)',
            transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] as any }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="cert-viewer-overlay"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                    overflow: 'hidden'
                }}
                onWheel={handleWheel}
                onClick={onClose} // Background click close
            >
                {/* Controls UI */}
                <div
                    style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 2010, display: 'flex', gap: '1rem', pointerEvents: 'auto' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => handleZoom(0.5)} className="control-btn"><FaSearchPlus /></button>
                    <button onClick={() => handleZoom(-0.5)} className="control-btn"><FaSearchMinus /></button>
                    <button onClick={() => { setScale(1); }} className="control-btn"><FaUndo /></button>
                    <button onClick={onClose} className="control-btn text-acid"><FaTimes /></button>
                </div>

                <div
                    style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2010, pointerEvents: 'none' }}
                >
                    <span className="font-mono text-cyan" style={{ background: 'rgba(0,0,0,0.8)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                        {title}
                    </span>
                </div>

                {/* Draggable Image Container */}
                <motion.div
                    ref={containerRef}
                    drag={scale > 1}
                    dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} // Simplified constraints
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                    style={{
                        position: 'relative',
                        width: 'auto',
                        height: 'auto',
                        maxHeight: '85vh',
                        maxWidth: '90vw',
                    }}
                >
                    <motion.img
                        src={imageSrc}
                        alt={title}
                        animate={{ scale: scale }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{
                            maxHeight: '85vh',
                            maxWidth: '90vw',
                            objectFit: 'contain',
                            display: 'block',
                            borderRadius: '4px',
                            boxShadow: '0 0 50px rgba(0, 255, 213, 0.2)',
                            cursor: scale > 1 ? 'grab' : 'zoom-in'
                        }}
                    />

                    {/* Lens/Grid Overlay Effect (Decoration) */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        background: 'linear-gradient(rgba(0,255,213,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,213,0.02) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        mixBlendMode: 'overlay',
                        opacity: 0.5
                    }} />
                </motion.div>

                <style>{`
                    .control-btn {
                        background: rgba(0, 20, 20, 0.8);
                        border: 1px solid var(--color-primary-cyan);
                        color: var(--color-primary-cyan);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .control-btn:hover {
                        background: var(--color-primary-cyan);
                        color: black;
                        box-shadow: 0 0 15px var(--color-primary-cyan);
                    }
                    .text-acid { color: var(--color-accent-acid); border-color: var(--color-accent-acid); }
                    .text-acid:hover { background: var(--color-accent-acid); box-shadow: 0 0 15px var(--color-accent-acid); }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
};

export default CertViewerModal;
