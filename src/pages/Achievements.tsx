import { useEffect, useState } from 'react';
import { useChibi } from '../context/ChibiContext';
import { achievementsData, type Achievement } from '../data/achievements';
import CertViewerModal from '../components/CertViewerModal';
import { motion, AnimatePresence } from 'framer-motion';

const Achievements = () => {
    const { speak } = useChibi();
    const [selectedCert, setSelectedCert] = useState<Achievement | null>(null);
    const [originRect, setOriginRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        speak("Accessing Certification Database...", 1500);
    }, [speak]);

    const handleCertClick = (e: React.MouseEvent, cert: Achievement) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setOriginRect(rect);
        setSelectedCert(cert);
    };

    return (
        <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', paddingBottom: '4rem' }}>
            <h1 className="text-glow" style={{ marginBottom: '3rem' }}>
                <span className="text-acid">{'>>'}</span> CREDENTIALS_LOG
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {achievementsData.map(cert => (
                    <div key={cert.id} className="lab-panel" style={{ display: 'flex', gap: '2rem', padding: '2rem', alignItems: 'start' }}>

                        {/* Interactive Thumbnail */}
                        <motion.div
                            style={{
                                width: '150px',
                                flexShrink: 0,
                                border: '1px solid var(--color-primary-cyan)',
                                padding: '5px',
                                background: 'rgba(0,0,0,0.3)',
                                cursor: 'zoom-in'
                            }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 15px var(--color-primary-cyan)' }}
                            onClick={(e) => handleCertClick(e, cert)}
                            layoutId={`cert-thumb-${cert.id}`}
                        >
                            <img
                                src={cert.previewImage}
                                alt="Certificate"
                                style={{ width: '100%', display: 'block', opacity: 0.9 }}
                            />
                        </motion.div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.4rem' }}>{cert.title}</h3>
                                <span className="font-mono text-acid" style={{ fontSize: '0.8rem', border: '1px solid var(--color-accent-acid)', padding: '2px 6px' }}>
                                    {cert.status}
                                </span>
                            </div>

                            <p className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--color-primary-cyan)', marginBottom: '1rem' }}>
                                {cert.date} | {cert.category}
                            </p>

                            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                                {cert.abstract}
                            </p>

                            <div style={{ background: 'rgba(100, 255, 218, 0.05)', padding: '1rem', borderLeft: '2px solid var(--color-primary-cyan)' }}>
                                <strong style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>KEY OUTCOME</strong>
                                {cert.keyOutcome}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Microscope Lens Viewer */}
            <AnimatePresence>
                {selectedCert && (
                    <CertViewerModal
                        isOpen={!!selectedCert}
                        onClose={() => setSelectedCert(null)}
                        imageSrc={selectedCert.previewImage}
                        title={selectedCert.title}
                        originRect={originRect}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Achievements;
