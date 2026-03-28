import { usePortfolio } from '../context/PortfolioContext';
import avtarImg from '../assets/avtar.png';

const Hero = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    
    return (
        <section id="hero" className="hero section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '120px' }}>
            <div className="container">
                <div className="hero-image fade-in" ref={addToRefs} style={{ marginBottom: '32px' }}>
                    <div className="image-wrapper">
                        <img src={avtarImg} alt="Shah Abdul Mazid" />
                    </div>
                </div>
                
                <div className="hero-content">
                    <div className="badge fade-in" ref={addToRefs}>Available for new opportunities</div>
                    <h1 className="fade-in" ref={addToRefs} style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, margin: '16px 0' }}>
                        Hi, I'm <span className="gradient-text">{data.hero.name}</span>
                    </h1>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                        {data.hero.title}
                    </p>
                    <div className="hero-btns fade-in" ref={addToRefs}>
                        <a href="#projects" className="btn btn-primary btn-gradient">View My Work</a>
                        <a href="#contact" className="btn btn-secondary btn-outline">Get In Touch</a>
                    </div>
                </div>
            </div>
            <style>{`
                .hero-grid { display: block; }
                .badge { display: inline-block; padding: 10px 24px; background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 100px; color: var(--primary); font-size: 0.8125rem; font-weight: 600; margin-bottom: 24px; }
                .hero-btns { display: flex; gap: 16px; margin-top: 40px; justify-content: center; }
                .image-wrapper { position: relative; width: 140px; height: 140px; margin: 0 auto; }
                .image-wrapper img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid #d946ef; padding: 2px; }
                .btn-gradient { background: linear-gradient(90deg, #818cf8, #f472b6); color: white; border: none; padding: 14px 32px; font-size: 1rem; }
                .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-color); padding: 14px 32px; font-size: 1rem; }
                .btn-outline:hover { background: rgba(0,0,0,0.03); }

                @media (max-width: 480px) {
                    .hero-btns { flex-direction: column; width: 100%; }
                    .hero-btns .btn { width: 100%; text-align: center; }
                    .image-wrapper { width: 100px; height: 100px; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
