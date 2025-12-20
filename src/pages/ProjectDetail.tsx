import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChibi } from '../context/ChibiContext';
import { projectsData, type Project } from '../data/projects';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
    const { id } = useParams();
    const { speak } = useChibi();

    const project = projectsData.find((p: Project) => p.id === id);

    useEffect(() => {
        if (project) {
            speak(`Accessing file: ${project.title}`, 2000);
        } else {
            speak("Error: File not found.", 2000);
        }
    }, [id, speak, project]);

    if (!project) {
        return (
            <div className="container flex-center" style={{ height: 'calc(100vh - var(--nav-height))' }}>
                <h2 className="text-acid">FILE_NOT_FOUND</h2>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', paddingBottom: '4rem' }}>
            <Link to="/projects" style={{ color: 'var(--color-primary-cyan)', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                {'<'} <span className="font-mono">BACK_TO_ARCHIVES</span>
            </Link>

            <div className="lab-panel" style={{ padding: '2rem', borderTop: '4px solid var(--color-primary-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{project.title}</h1>
                    <span className="font-mono text-acid" style={{ border: '1px solid var(--color-accent-acid)', padding: '0.2rem 0.5rem' }}>
                        STATUS: {project.status}
                    </span>
                </div>
                <p className="text-cyan font-mono" style={{ margin: '0.5rem 0 2rem 0' }}>CATEGORY: {project.category}</p>

                {/* Main Preview with Youtube Logic */}
                <div style={{ marginBottom: '3rem' }}>
                    {(() => {
                        const getYoutubeId = (url: string) => {
                            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                            const match = url.match(regExp);
                            return (match && match[2].length === 11) ? match[2] : null;
                        };

                        const youtubeId = project.demoLink ? getYoutubeId(project.demoLink) : null;
                        const previewSrc = youtubeId
                            ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
                            : project.previewImage;

                        if (!previewSrc || previewSrc.includes('placeholder')) return null;

                        return (
                            <div style={{ position: 'relative', width: '100%', maxHeight: '500px', overflow: 'hidden', borderBottom: '2px solid var(--color-primary-cyan)', marginBottom: '1rem' }}>
                                <motion.img
                                    layoutId={`project-img-${project.id}`}
                                    src={previewSrc}
                                    alt="Main Preview"
                                    style={{ width: '100%', objectFit: 'cover', display: 'block' }}
                                    transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                                />

                                {/* Overlay Play Button for YouTube */}
                                {youtubeId && (
                                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer" style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '80px',
                                        height: '80px',
                                        background: 'rgba(0, 240, 255, 0.8)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 0 30px var(--color-primary-cyan)'
                                    }}>
                                        <div style={{
                                            width: 0,
                                            height: 0,
                                            borderTop: '15px solid transparent',
                                            borderBottom: '15px solid transparent',
                                            borderLeft: '25px solid black',
                                            marginLeft: '5px'
                                        }} />
                                    </a>
                                )}
                            </div>
                        );
                    })()}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {project.demoLink && (
                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="lab-panel" style={{
                                padding: '0.8rem 1.5rem',
                                background: 'var(--color-primary-cyan)',
                                color: 'black',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}>
                                {project.demoLink.includes('youtu') ? '▶ WATCH DEMO (YOUTUBE)' :
                                    project.demoLink.includes('colab') ? '📄 VIEW NOTEBOOK (COLAB)' :
                                        '↗ VISIT PROJECT'}
                            </a>
                        )}

                        {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="lab-panel" style={{
                                padding: '0.8rem 1.5rem',
                                background: 'transparent',
                                border: '1px solid var(--color-primary-cyan)',
                                color: 'var(--color-primary-cyan)',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}>
                                {'{ } CODE REPO (GITHUB)'}
                            </a>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                    <div style={{ flex: '1 1 250px' }}>
                        <h3 className="text-glow">SPECIFICATIONS</h3>
                        <ul className="font-mono" style={{ listStyle: 'none', padding: 0, color: 'var(--color-text-muted)' }}>
                            {project.tech.map((t: string) => (
                                <li key={t} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0' }}>
                                    {'>'} {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ flex: '2 1 400px' }}>
                        <h3 className="text-glow">ABSTRACT / OVERVIEW</h3>
                        <p style={{ lineHeight: 1.8 }}>{project.abstract}</p>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(100, 255, 218, 0.05)', borderLeft: '2px solid var(--color-primary-cyan)' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary-cyan)' }}>KEY OUTCOME</h4>
                            <p style={{ margin: 0, fontSize: '1rem', fontStyle: 'italic' }}>{project.keyOutcome}</p>
                        </div>
                    </div>
                </div>

                {/* Optional Gallery */}
                {project.galleryImages && project.galleryImages.length > 0 && (
                    <div style={{ marginTop: '4rem' }}>
                        <h3 className="text-glow">VISUAL_EVIDENCE</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {project.galleryImages.map((img, idx) => (
                                <img key={idx} src={img} alt={`Gallery ${idx}`} style={{ width: '100%', border: '1px solid var(--color-glass-border)' }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;
