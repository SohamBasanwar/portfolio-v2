import React, { type ReactNode } from 'react';
import { usePageTransition } from '../context/TransitionContext';
import { type TransitionMode } from './PageTransitionOverlay';

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    mode?: TransitionMode;
}

const TransitionLink: React.FC<TransitionLinkProps> = ({ to, children, className, style, mode, ...props }) => {
    const { navigateWithTransition, isTransitioning } = usePageTransition();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isTransitioning) {
            navigateWithTransition(to, mode);
        }
    };

    return (
        <a
            href={to}
            onClick={handleClick}
            className={className}
            style={{ cursor: 'pointer', ...style }}
            {...props}
        >
            {children}
        </a>
    );
};

export default TransitionLink;
