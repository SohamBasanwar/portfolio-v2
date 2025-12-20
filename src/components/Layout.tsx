
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import BackgroundCanvas from './BackgroundCanvas';
import GuideActor from './GuideActor';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <BackgroundCanvas />
            <Navbar />

            <main style={{ minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
                {children}
            </main>

            <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>© 2025 Soham Basanwar. Built with Bio-Cyber Tech.</p>
                <p style={{ opacity: 0.7 }}>
                    <a href="https://github.com/SohamBasanwar" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Source available on GitHub
                    </a>
                </p>
            </footer>

            {/* Guide is global, but handles its own visibility based on logic */}
            <GuideActor />
        </>
    );
};

export default Layout;
