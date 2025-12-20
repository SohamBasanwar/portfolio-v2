import { useEffect } from 'react';
import { useChibi } from '../context/ChibiContext';
import { experienceData } from '../data/experience';
import ScanReveal from '../components/ScanReveal';

const Experience = () => {
    const { speak } = useChibi();

    useEffect(() => {
        speak("Loading professional timeline...", 1500);
    }, [speak]);

    return (
        <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', paddingBottom: '4rem' }}>
            <ScanReveal label="TIMELINE" delay={0.1}>
                <h1 className="text-glow" style={{ marginBottom: '3rem' }}>
                    <span className="text-acid">{'>>'}</span> EXPERIENCE_LOG
                </h1>
            </ScanReveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {experienceData.map((job, index) => (
                    <ScanReveal key={job.id} label={job.status} delay={0.2 + index * 0.1}>
                        <div className="lab-panel" style={{ padding: '2rem', position: 'relative', borderLeft: '4px solid var(--color-primary-cyan)' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{job.company}</h2>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-cyan)', fontFamily: 'var(--font-mono)' }}>{job.role}</h3>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="font-mono text-acid" style={{
                                        display: 'inline-block',
                                        border: '1px solid var(--color-accent-acid)',
                                        padding: '4px 8px',
                                        fontSize: '0.8rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {job.status}
                                    </div>
                                    <div className="font-mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        {job.dateRange}
                                    </div>
                                </div>
                            </div>

                            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                                {job.bullets.map((bullet, i) => (
                                    <li key={i} style={{ marginBottom: '0.5rem' }}>{bullet}</li>
                                ))}
                            </ul>

                            {/* Decorative Corner */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '20px',
                                height: '20px',
                                borderTop: '2px solid var(--color-primary-cyan)',
                                borderRight: '2px solid var(--color-primary-cyan)',
                                opacity: 0.5
                            }} />
                        </div>
                    </ScanReveal>
                ))}
            </div>
        </div>
    );
};

export default Experience;
