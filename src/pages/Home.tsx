import { useEffect } from 'react';
import { useChibi } from '../context/ChibiContext';
import TransitionLink from '../components/TransitionLink';
import CapabilitiesCylinder from '../components/CapabilitiesCylinder';
import ScanReveal from '../components/ScanReveal';
import { skills } from '../data/skills';

const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const Home = () => {
    const { speak } = useChibi();
    const age = calculateAge("2005-12-03");

    useEffect(() => {
        speak("Identity verified: Soham Basanwar. Access granted to Portfolio v2.", 4000);
    }, [speak]);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>

            {/* HERO SECTION */}
            <section style={{
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: 'var(--nav-height)'
            }}>
                <ScanReveal label="SUBJECT_01" delay={0.1}>
                    <div style={{ opacity: 0.7, fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
                        :: SUBJECT_ID: 001 :: SOHAM_BASANWAR
                    </div>
                    <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>
                        Computer Science Student<br />
                        <span className="text-cyan text-glow">AI + Full-Stack Builder</span>
                    </h1>

                    <div className="font-mono text-acid" style={{ fontSize: '1rem', marginBottom: '2rem', display: 'inline-block', borderBottom: '1px solid var(--color-accent-acid)', paddingBottom: '5px' }}>
                        Incoming Intern — NSTEM (Summer 2026)
                    </div>

                    <div style={{
                        borderLeft: '2px solid var(--color-primary-cyan)',
                        paddingLeft: '1.5rem',
                        marginBottom: '3rem',
                        maxWidth: '700px'
                    }}>
                        <p style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                            I build practical systems like <strong>PersistAI</strong> and <strong>Saya</strong>—focused on real product impact.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>» Python • React • C++ • AI/NLP workflows</li>
                            <li>» Scoring, personalization, automation, and developer-first UX</li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <TransitionLink to="/projects" mode="FOCUS" className="lab-panel" style={{
                            padding: '1rem 2.5rem',
                            color: 'var(--color-primary-cyan)',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(100, 255, 218, 0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            View Projects
                        </TransitionLink>
                        <TransitionLink to="/contact" mode="FOCUS" style={{ padding: '1rem 2rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                            Contact Me
                        </TransitionLink>
                    </div>
                </ScanReveal>
            </section>

            {/* RESEARCHER PROFILE (ABOUT + MYSELF) */}
            <section style={{ marginBottom: '6rem' }}>
                <ScanReveal label="ABOUT_ME" delay={0.2}>
                    <h2 className="text-cyan"><span className="text-acid">{'//'}</span> ABOUT_ME</h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
                        {/* Left: Stats Card */}
                        <div className="lab-panel" style={{ padding: '2rem', flex: '1 1 300px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#0b2d30', margin: '0 auto', border: '2px solid var(--color-primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>IMG_N/A</span>
                                </div>
                                <h3 style={{ marginTop: '1rem' }}>Soham Basanwar</h3>
                                <p className="text-acid font-mono">STATUS: ACTIVE</p>
                            </div>

                            <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0' }}>
                                    <span>AGE:</span> <span className="text-cyan">{age} Years</span>
                                </p>
                                <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0' }}>
                                    <span>LOC:</span> <span>Chicago, IL</span>
                                </p>
                                <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0' }}>
                                    <span>EDU:</span> <span>BS CS @ UIC</span>
                                </p>
                            </div>
                        </div>

                        {/* Right: Bio */}
                        <div className="lab-panel" style={{ padding: '2rem', flex: '2 1 400px' }}>
                            <h3 className="text-glow" style={{ marginBottom: '1.5rem' }}>Profile Summary</h3>
                            <p style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                I’m a Computer Science student at the University of Illinois Chicago (UIC) and a builder who likes projects that solve real problems.
                                I work across AI and full-stack development, creating tools like <strong>PersistAI</strong> and <strong>Saya</strong> to improve how people work and communicate.
                            </p>
                            <p style={{ lineHeight: 1.8 }}>
                                My strength lies in bridging Python/AI workflows with React-based products. I am impact-driven and open to connecting for AI product roles, developer tools, or end-to-end shipping.
                            </p>
                        </div>
                    </div>
                </ScanReveal>
            </section>

            {/* EXPERIENCE PREVIEW */}
            <section style={{ marginBottom: '6rem' }}>
                <ScanReveal label="EXPERIENCE" delay={0.2}>
                    <h2 className="text-cyan"><span className="text-acid">{'//'}</span> EXPERIENCE</h2>

                    <div className="lab-panel" style={{ padding: '2rem', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>NSTEM</h3>
                                <span className="text-acid font-mono" style={{ border: '1px solid var(--color-accent-acid)', padding: '2px 8px', fontSize: '0.8rem' }}>
                                    INCOMING
                                </span>
                            </div>
                            <p className="text-cyan font-mono" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                Web & Technology Development Intern
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                Summer 2026 (3 months)
                            </p>
                        </div>

                        <TransitionLink to="/experience" mode="FOCUS" style={{
                            padding: '0.8rem 2rem',
                            border: '1px solid var(--color-primary-cyan)',
                            color: 'var(--color-primary-cyan)',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            View Experience
                        </TransitionLink>
                    </div>
                </ScanReveal>
            </section>

            {/* SKILLS DNA */}
            <section style={{ marginBottom: '6rem' }}>
                <ScanReveal label="SKILLS_DNA" delay={0.2}>
                    <h2 className="text-cyan text-right"><span className="text-acid">{'//'}</span> CAPABILITIES</h2>
                    <div style={{ marginTop: '2rem' }}>
                        <CapabilitiesCylinder skills={skills} />
                    </div>
                </ScanReveal>
            </section>

        </div>
    );
};

export default Home;
