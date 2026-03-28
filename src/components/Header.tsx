import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import avtarImg from '../assets/avtar.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('light-mode');
    };

    return (
        <header className={scrolled ? 'scrolled' : ''} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            padding: scrolled ? '12px 0' : '20px 0',
            transition: 'var(--transition)',
            backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid var(--border-color)' : 'none'
        }}>
            <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={avtarImg} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>Shah Abdul Mazid</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <ul className="nav-links" style={{ display: 'flex', listStyle: 'none', gap: '24px', alignItems: 'center' }}>
                        <li><a href="#about">About</a></li>
                        <li><a href="#education">Education</a></li>
                        <li><a href="#work">Experience</a></li>
                        <li><a href="#achievements">Achievements</a></li>
                        <li><a href="#skills">Skills</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#blog">Blog</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <button 
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        id="theme-toggle"
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        )}
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to="/login/admin" className="btn btn-secondary btn-small" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>⚙ Admin</Link>
                    </div>
                </div>
            </nav>
            <style>{`
                #theme-toggle {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition);
                }
                #theme-toggle:hover { border-color: var(--primary); }
                .nav-links a { text-decoration: none; color: var(--text-color); font-size: 0.9375rem; font-weight: 500; opacity: 0.7; transition: var(--transition); }
                .nav-links a:hover { opacity: 1; color: var(--primary); }
                @media (max-width: 768px) { .nav-links { display: none; } }
            `}</style>
        </header>
    );
};

export default Header;
