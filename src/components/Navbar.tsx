import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import TransitionLink from './TransitionLink';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className={styles.navbar}>
            <TransitionLink to="/" className={styles.logo} onClick={closeMenu}>
                SOHAM<span className={styles.logoSpan}>.LAB</span>
            </TransitionLink>

            {/* Desktop Menu */}
            <div className={styles.desktopMenu}>
                <TransitionLink to="/projects" className={styles.navLink}>Projects</TransitionLink>
                <TransitionLink to="/experience" className={styles.navLink}>Experience</TransitionLink>
                <TransitionLink to="/achievements" className={styles.navLink}>Achievements</TransitionLink>
                <TransitionLink to="/contact" className={styles.navLink}>Contact</TransitionLink>
            </div>

            {/* Mobile Toggle */}
            <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle Menu">
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.mobileOverlay}
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <TransitionLink to="/projects" className={styles.mobileLink} onClick={closeMenu}>Projects</TransitionLink>
                        <TransitionLink to="/experience" className={styles.mobileLink} onClick={closeMenu}>Experience</TransitionLink>
                        <TransitionLink to="/achievements" className={styles.mobileLink} onClick={closeMenu}>Achievements</TransitionLink>
                        <TransitionLink to="/contact" className={styles.mobileLink} onClick={closeMenu}>Contact</TransitionLink>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
