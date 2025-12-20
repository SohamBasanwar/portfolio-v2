import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChibi } from '../context/ChibiContext';
import styles from './GuideActor.module.css';
import { FaTimes, FaCrosshairs, FaPaperPlane, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { chatWithAI } from '../services/ai';
import { motion, AnimatePresence } from 'framer-motion';

// Assets for GuideActor (Nano-Bot / Drone style)
const getDroneStatus = (state: string) => {
    switch (state) {
        case 'HAPPY': return 'ACK';
        case 'POUT': return 'ERR';
        case 'CONFUSED': return '???';
        case 'THINKING': return 'PROC';
        default: return 'IDLE';
    }
};

const GuideActor: React.FC = () => {
    const { state, setState, message, isMuted, toggleMute, speak } = useChibi();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Check route for "Vanish" behavior
    const location = useLocation();
    const isContactPage = location.pathname === '/contact';

    // Initial Greeting
    useEffect(() => {
        if (isOpen && history.length === 0) {
            setHistory([{ role: 'assistant', content: "Greetings. I am the system navigator. How can I assist you with Soham's portfolio data?" }]);
        }
    }, [isOpen]);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setIsLoading(true);
        setState('THINKING');

        // Optimistic UI
        const newHistory = [...history, { role: 'user' as const, content: userMsg }];
        setHistory(newHistory);

        // API Call
        const response = await chatWithAI(userMsg, newHistory);

        setHistory(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
        setState('HAPPY');

        // Voice feedback
        if (!isMuted) speak(response.substring(0, 50) + "...", 2000);
    };

    const shouldShow = state !== 'HIDDEN' && !isContactPage;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9, filter: 'blur(5px)' }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'fixed', bottom: 'clamp(1rem, 5vw, 2rem)', right: 'clamp(1rem, 5vw, 2rem)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'auto' }}
                >

                    {/* Chat Window */}
                    {isOpen && (
                        <div style={{
                            width: '300px',
                            maxWidth: 'calc(100vw - 3rem)',
                            height: '400px',
                            maxHeight: '60vh',
                            background: 'rgba(5, 20, 20, 0.95)',
                            border: '1px solid var(--color-primary-cyan)',
                            borderRadius: '12px',
                            marginBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {/* Header */}
                            <div style={{
                                padding: '0.8rem',
                                background: 'rgba(0, 240, 255, 0.1)',
                                borderBottom: '1px solid var(--color-primary-cyan)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span className="font-mono text-cyan" style={{ fontSize: '0.8rem' }}>GUIDE_LINK // ONLINE</span>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {/* Mute Toggle */}
                                    <div onClick={toggleMute} style={{ cursor: 'pointer', color: isMuted ? 'var(--color-primary-cyan)' : 'var(--color-text-muted)' }} title={isMuted ? "Unmute" : "Mute"}>
                                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                    </div>
                                    {/* Close */}
                                    <FaTimes style={{ cursor: 'pointer', color: 'var(--color-primary-cyan)' }} onClick={() => setIsOpen(false)} />
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {history.map((msg, idx) => (
                                    <div key={idx} style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.role === 'user' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        padding: '0.6rem 0.8rem',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        maxWidth: '85%',
                                        border: `1px solid ${msg.role === 'user' ? 'var(--color-primary-cyan)' : 'transparent'}`
                                    }}>
                                        {msg.content}
                                    </div>
                                ))}
                                {isLoading && <div className="text-acid font-mono" style={{ fontSize: '0.8rem' }}>Processing data...</div>}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSubmit} style={{
                                padding: '0.8rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Query database..."
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                                <button type="submit" disabled={isLoading} style={{ background: 'none', border: 'none', color: 'var(--color-primary-cyan)', cursor: 'pointer' }}>
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Drone Avatar */}
                    <div className={`${styles.container} ${isMuted ? styles.muted : ''}`} style={{ position: 'relative' }}>
                        {!isOpen && message && !isMuted && (
                            <div className={styles.bubble}>
                                <span className={styles.terminalPrefix}>{'>'}</span> {message}
                            </div>
                        )}

                        <div className={styles.droneBody} onClick={() => setIsOpen(!isOpen)} title={isOpen ? "Close Interface" : "Access Guide"}>
                            <div className={styles.droneLens}>
                                <div className={styles.droneGlow} style={{
                                    background: state === 'POUT' ? 'var(--color-accent-danger)' : 'var(--color-primary-cyan)',
                                    boxShadow: `0 0 10px ${state === 'POUT' ? 'var(--color-accent-danger)' : 'var(--color-primary-cyan)'}`
                                }} />
                            </div>

                            {state === 'THINKING' && <div style={{ position: 'absolute', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}><FaCrosshairs /></div>}

                            <div className={styles.droneStatus}>
                                {getDroneStatus(state)}
                            </div>
                            {isMuted && <div className={styles.muteOverlay}><FaTimes /></div>}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GuideActor;
