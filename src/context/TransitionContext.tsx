import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTransitionOverlay, { type TransitionPhase, type TransitionMode } from '../components/PageTransitionOverlay';
import { ANIMATION_SETTINGS } from '../animations/settings';

interface TransitionContextType {
    navigateWithTransition: (to: string, explicitMode?: TransitionMode) => void;
    isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [phase, setPhase] = useState<TransitionPhase>('IDLE');
    const [mode, setMode] = useState<TransitionMode>('FOCUS');
    const [nextRoute, setNextRoute] = useState<string | null>(null);

    const getAutoMode = (from: string, to: string): TransitionMode => {
        // Normalize paths (remove trailing slash, empty becomes /)
        const normalize = (p: string) => p.replace(/\/$/, '') || '/';
        const current = normalize(from);
        const target = normalize(to);

        const FLUID_ROUTES = ['/', '/projects', '/achievements', '/experience', '/contact'];

        if (FLUID_ROUTES.includes(current) && FLUID_ROUTES.includes(target)) {
            return 'FLUID';
        }

        return 'FOCUS';
    };

    const navigateWithTransition = useCallback((to: string, explicitMode?: TransitionMode) => {
        if (location.pathname === to) return;

        const selectedMode = explicitMode || getAutoMode(location.pathname, to);
        setMode(selectedMode);
        setNextRoute(to);
        setPhase('IN');
    }, [location.pathname]);

    // Called when Cover Animation Finishes
    const handleMiddlePoint = useCallback(() => {
        if (nextRoute) {
            setPhase('HOLD');
            navigate(nextRoute);

            // Determine hold duration based on mode
            const duration = mode === 'FLUID'
                ? ANIMATION_SETTINGS.transitions.fluid.holdDuration * 1000
                : 100; // Minimal hold for focus mode (just enough for DOM swap)

            setTimeout(() => {
                setPhase('OUT');
            }, duration);
        }
    }, [nextRoute, navigate, mode]);

    const handleComplete = useCallback(() => {
        setPhase('IDLE');
        setNextRoute(null);
    }, []);

    return (
        <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning: phase !== 'IDLE' }}>
            {children}
            <PageTransitionOverlay
                phase={phase}
                mode={mode}
                onMiddlePointReached={handleMiddlePoint}
                onComplete={handleComplete}
            />
        </TransitionContext.Provider>
    );
};

export const usePageTransition = () => {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error("usePageTransition must be used within a TransitionProvider");
    }
    return context;
};

