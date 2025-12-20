import { Link } from 'react-router-dom';
import ScanReveal from '../components/ScanReveal';

const NotFound = () => {
    return (
        <div className="container" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: 'calc(var(--nav-height))',
            paddingBottom: '4rem'
        }}>
            <div style={{ marginBottom: '2rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ScanReveal label="MISSING_ASSET" delay={0.2}>
                    <img
                        src="/Not_Found.png"
                        alt="404 Not Found"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '450px',
                            width: 'auto',
                            filter: 'drop-shadow(0 0 20px rgba(0, 255, 213, 0.2))',
                            borderRadius: '8px',
                            display: 'block'
                        }}
                    />
                </ScanReveal>
            </div>

            <ScanReveal label="SYSTEM_HALT" delay={0.4}>
                <h2 className="text-cyan text-glow" style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>SIGNAL LOST</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                    The specimen you are looking for has been moved or does not exist in this sector.
                </p>
                <Link to="/" style={{
                    padding: '1rem 2rem',
                    border: '1px solid var(--color-primary-cyan)',
                    color: 'var(--color-primary-cyan)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 'bold',
                    display: 'inline-block'
                }}>
                    Return to Lab
                </Link>
            </ScanReveal>
        </div>
    );
};

export default NotFound;
