import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import avtarImg from '../assets/avtar.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    <ul className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`} style={{ listStyle: 'none' }}>
                        <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                        <li><Link to="/education" onClick={() => setIsMenuOpen(false)}>Education</Link></li>
                        <li><Link to="/work" onClick={() => setIsMenuOpen(false)}>Experience</Link></li>
                        <li><Link to="/achievements" onClick={() => setIsMenuOpen(false)}>Achievements</Link></li>
                        <li><Link to="/skills" onClick={() => setIsMenuOpen(false)}>Skills</Link></li>
                        <li><Link to="/projects" onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
                        <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
                        <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                        <li className="mobile-only"><Link to="/login/admin" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', width: '100%', display: 'block' }}>⚙ Admin Panel</Link></li>
                    </ul>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                        <button 
                            className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </button>
                        <div style={{ display: 'none' }} className="admin-link-desktop">
                            <Link to="/login/admin" className="btn btn-secondary btn-small" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>⚙ Admin</Link>
                        </div>
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
                .nav-links { display: flex; gap: 32px; align-items: center; }
                .nav-links a { text-decoration: none; color: var(--text-color); font-size: 0.9375rem; font-weight: 500; opacity: 0.7; transition: var(--transition); }
                .nav-links a:hover { opacity: 1; color: var(--primary); }
                .mobile-only { display: none; }
                
                .mobile-toggle { 
                    display: none; width: 40px; height: 40px; background: transparent; border: 1px solid var(--border-color); 
                    border-radius: 12px; cursor: pointer; flex-direction: column; justify-content: center; align-items: center; gap: 4px;
                }
                .mobile-toggle .bar { width: 20px; height: 2px; background: var(--text-color); transition: var(--transition); border-radius: 2px; }

                @media (min-width: 993px) {
                    .admin-link-desktop { display: block !important; }
                }

                @media (max-width: 992px) {
                    .nav-links { 
                        position: fixed; top: 0; right: -100%; width: 280px; height: 100vh; background: var(--bg-color); 
                        flex-direction: column; padding: 100px 40px; border-left: 1px solid var(--border-color);
                        transition: var(--transition); z-index: 1000; box-shadow: -10px 0 30px rgba(0,0,0,0.1);
                    }
                    .nav-links.mobile-open { right: 0; }
                    .mobile-toggle { display: flex; }
                    .mobile-toggle.active .bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
                    .mobile-toggle.active .bar:nth-child(2) { opacity: 0; }
                    .mobile-toggle.active .bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
                    .nav-links .mobile-only { display: block; }
                }
            `}</style>
        </header>
    );
};

export default Header;
