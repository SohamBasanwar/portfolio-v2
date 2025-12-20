
import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useChibi } from '../context/ChibiContext';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
    const form = useRef<HTMLFormElement>(null);
    const { speak } = useChibi();

    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.current) return;

        setStatus('SENDING');
        speak("Initiating secure transmission protocol...", 2000);

        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            form.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
            .then((result) => {
                console.log(result.text);
                setStatus('SUCCESS');
                speak("Transmission complete. Acknowledgment received.", 3000);
                if (form.current) form.current.reset();
            }, (error) => {
                console.log(error.text);
                setStatus('ERROR');
                speak("Transmission failed. Network interference detected.", 3000);
            });
    };

    return (
        <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 2rem)', paddingBottom: '4rem', position: 'relative' }}>

            {/* Comic Stamp */}
            <motion.div
                initial={{ scale: 3, opacity: 0, rotate: -15, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, rotate: -5, filter: 'blur(0px)' }}
                transition={{ delay: 2.3, type: "spring", stiffness: 200, damping: 12 }}
                style={{
                    position: 'absolute',
                    top: '120px',
                    left: '20px',
                    border: '5px solid var(--color-primary-cyan)',
                    padding: '0.5rem 1rem',
                    color: 'var(--color-primary-cyan)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-heading)',
                    zIndex: 0,
                    opacity: 0.3,
                    pointerEvents: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '5px'
                }}
            >
                TOP_SECRET_AUTH
            </motion.div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 className="text-glow">
                    <span className="text-acid">{'//'}</span> COMM_UPLINK
                </h1>
                <p style={{ color: 'var(--color-primary-cyan)', marginBottom: '3rem', fontFamily: 'var(--font-mono)' }}>
                    ESTABLISH DIRECT CONNECTION :: SECURE CHANNEL
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                {/* Contact Form */}
                <div className="lab-panel" style={{ padding: '2rem' }}>
                    <form ref={form} onSubmit={sendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label className="font-mono" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                SENDER_ID (NAME)
                            </label>
                            <input
                                type="text"
                                name="from_name"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--color-primary-cyan)',
                                    color: 'white',
                                    fontFamily: 'inherit',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 15px var(--color-primary-cyan)'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>

                        <div>
                            <label className="font-mono" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                RETURN_ADDRESS (EMAIL)
                            </label>
                            <input
                                type="email"
                                name="reply_to"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--color-primary-cyan)',
                                    color: 'white',
                                    fontFamily: 'inherit',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 15px var(--color-primary-cyan)'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>

                        <div>
                            <label className="font-mono" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                PAYLOAD (MESSAGE)
                            </label>
                            <textarea
                                name="message"
                                required
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--color-primary-cyan)',
                                    color: 'white',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 15px var(--color-primary-cyan)'}
                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'SENDING' || status === 'SUCCESS'}
                            style={{
                                padding: '1rem',
                                background: status === 'SUCCESS' ? 'var(--color-secondary-teal)' : 'var(--color-primary-cyan)',
                                color: 'black',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: status === 'SENDING' ? 'wait' : 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginTop: '1rem',
                                opacity: status === 'SENDING' ? 0.7 : 1
                            }}
                        >
                            {status === 'SENDING' ? 'TRANSMITTING...' : status === 'SUCCESS' ? 'SENT SUCCESSFULLY' : 'INITIATE TRANSMISSION'}
                        </button>

                        {status === 'ERROR' && (
                            <p style={{ color: '#ff4d4d', marginTop: '0.5rem' }}>Error: Transmission Failed. Check console.</p>
                        )}
                    </form>
                </div>

                {/* Info Panel */}
                <div>
                    <div className="lab-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h3 className="text-glow">DIRECT_CONTACT</h3>
                        <p style={{ margin: '1rem 0' }}>Connect via social channels or email:</p>

                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                            {/* Facebook */}
                            <a href="https://www.facebook.com/share/1D95HaQjnA/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-cyan)', transition: 'all 0.3s ease' }}>
                                <FaFacebook size={32} onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-accent-acid)')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-primary-cyan)')} />
                            </a>

                            {/* Instagram */}
                            <a href="https://www.instagram.com/sohambasanwar?igsh=MWcwdWRmZnV4dWJ5cQ==" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-cyan)', transition: 'all 0.3s ease' }}>
                                <FaInstagram size={32} onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-accent-acid)')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-primary-cyan)')} />
                            </a>

                            {/* Email */}
                            <a href="mailto:sohamdono03@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-cyan)', transition: 'all 0.3s ease' }}>
                                <FaEnvelope size={32} onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-accent-acid)')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-primary-cyan)')} />
                            </a>

                            {/* LinkedIn */}
                            <a href="https://www.linkedin.com/in/sohambasanwar/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-cyan)', transition: 'all 0.3s ease' }}>
                                <FaLinkedinIn size={32} onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-accent-acid)')} onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-primary-cyan)')} />
                            </a>
                        </div>
                    </div>

                    <div className="lab-panel" style={{ padding: '2rem' }}>
                        <h3 className="text-glow">NETWORK_STATUS</h3>
                        <ul className="font-mono" style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                            <li style={{ marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>RESPONSE_TIME:</span> <span className="text-cyan">~24 HRS</span>
                            </li>
                            <li style={{ marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>AVAILABILITY:</span> <span className="text-acid">OPEN FOR WORK</span>
                            </li>
                            <li>
                                <span style={{ color: 'var(--color-text-muted)' }}>LOCATION:</span> Chicago, IL
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

