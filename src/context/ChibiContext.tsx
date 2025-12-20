import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ChibiState = 'IDLE' | 'HAPPY' | 'POUT' | 'CONFUSED' | 'HIDDEN' | 'THINKING';

interface ChibiContextType {
  state: ChibiState;
  setState: (state: ChibiState) => void;
  message: string | null;
  speak: (msg: string, duration?: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const ChibiContext = createContext<ChibiContextType | undefined>(undefined);

export const ChibiProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ChibiState>('IDLE');
  const [message, setMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('chibi_muted');
    return saved === 'true';
  });

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('chibi_muted', String(next));
      return next;
    });
  };

  const speak = (msg: string, duration = 3000) => {
    if (isMuted || state === 'HIDDEN') return;
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

  // Reset to IDLE after a reaction unless HIDDEN
  useEffect(() => {
    if (state === 'HAPPY' || state === 'POUT' || state === 'CONFUSED') {
      const timer = setTimeout(() => {
        setState('IDLE');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <ChibiContext.Provider value={{ state, setState, message, speak, isMuted, toggleMute }}>
      {children}
    </ChibiContext.Provider>
  );
};

export const useChibi = () => {
  const context = useContext(ChibiContext);
  if (!context) throw new Error('useChibi must be used within a ChibiProvider');
  return context;
};
