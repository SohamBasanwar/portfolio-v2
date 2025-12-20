import { useEffect, useState } from 'react';
import { useChibi } from '../context/ChibiContext';
import TransitionLink from '../components/TransitionLink';
import { motion } from 'framer-motion';
import { projectsData } from '../data/projects';
import ScanReveal from '../components/ScanReveal';


const Projects = () => {
    const { speak } = useChibi();
    const [hovered, setHovered] = useState<string | null>(null);

    useEffect(() => {
        speak("Loading project archives...", 1500);
    }, [speak]);

    return (
        <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', paddingBottom: '4rem' }}>
            <ScanReveal label="DIRECTORY">
                <h1 className="text-glow">
                    <span className="text-acid">{'>>'}</span> PROJECT_ARCHIVES
                </h1>
            </ScanReveal>

            {/* PROJECTS GRID */}
            <ScanReveal label="INDEX" delay={0.2}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '2rem',
                    marginTop: '3rem'
                }}>
                    {projectsData.map((project) => (
                        <TransitionLink to={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                            <motion.div
                                className="lab-panel"
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    border: hovered === project.id ? '1px solid var(--color-primary-cyan)' : '1px solid var(--color-glass-border)',
                                    transition: 'border 0.3s'
                                }}
                                onMouseEnter={() => setHovered(project.id)}
                                onMouseLeave={() => setHovered(null)}
                                whileHover={{ scale: 1.01 }}
                            >
                                {/* Image Preview */}
                                <div style={{
                                    height: '200px',
                                    background: '#000',
                                    borderBottom: '1px solid var(--color-glass-border)',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    {project.previewImage.includes('placeholder') ? (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontFamily: 'monospace' }}>
                                            IMG_PROCESSING
                                        </div>
                                    ) : (
                                        <motion.img
                                            layoutId={`project-img-${project.id}`}
                                            src={project.previewImage}
                                            alt={project.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                                        />
                                    )}

                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'var(--color-bg-deep)',
                                        border: '1px solid var(--color-primary-cyan)',
                                        color: 'var(--color-primary-cyan)',
                                        padding: '2px 8px',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        zIndex: 2
                                    }}>
                                        {project.status}
                                    </div>
                                </div>

                                {/* Info */}
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                                        {project.category}
                                    </div>
                                    <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.4rem' }}>{project.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#b0b8c6', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                                        {project.abstract.length > 120 ? project.abstract.substring(0, 120) + '...' : project.abstract}
                                    </p>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {project.tech.slice(0, 4).map(t => (
                                            <span key={t} style={{
                                                fontSize: '0.7rem',
                                                padding: '4px 8px',
                                                background: 'rgba(100, 255, 218, 0.05)',
                                                border: '1px solid rgba(100, 255, 218, 0.2)',
                                                color: 'var(--color-primary-cyan)'
                                            }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </TransitionLink>
                    ))}
                </div>
            </ScanReveal>
        </div>
    );
};

export default Projects;
