import { usePortfolio } from '../context/PortfolioContext';
import avtarImg from '../assets/avtar.png';

const DOB = new Date(2001, 5, 1); // June 1, 2001

const getAge = () => {
    const now = new Date();
    let years = now.getFullYear() - DOB.getFullYear();
    let months = now.getMonth() - DOB.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years} years`;
};

const About = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    return (
        <section id="about" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">About Me</span>
                    <h2>A Digital Craftsman with a <span className="gradient-text">Passion</span></h2>
                </div>
                <div className="about-grid">
                    <div className="about-image fade-in" ref={addToRefs}>
                        <div className="img-card">
                            <img src={avtarImg} alt="Shah Abdul Mazid" />
                        </div>
                    </div>
                    <div className="about-text fade-in" ref={addToRefs}>
                        {data.about.bio.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className={idx === 0 ? "lead" : ""}>{paragraph}</p>
                        ))}
                        <div className="about-stats">
                            <div className="stat">
                                <span className="number">{getAge()}</span>
                                <span className="label">Age</span>
                            </div>
                            <div className="stat">
                                <span className="number">{data.about.projects}</span>
                                <span className="label">Projects & Research</span>
                            </div>
                        </div>
                        <a href="https://github.com/Shah-Abdul-Mazid" target="_blank" className="btn btn-primary">My GitHub</a>
                    </div>
                </div>
            </div>
            <style>{`
                .about-grid { display: flex; flex-direction: column; gap: 48px; align-items: center; text-align: center; max-width: 900px; margin: 0 auto; }
                .img-card { 
                    position: relative; border-radius: 32px; overflow: hidden; 
                    background: var(--border-color); border: 1px solid var(--border-color); 
                    width: 320px; height: 400px; 
                }
                .img-card img { width: 100%; height: 100%; object-fit: cover; object-position: center 15%; display: block; filter: grayscale(20%); transition: 0.5s; }
                .img-card:hover img { filter: grayscale(0); transform: scale(1.05); }
                .about-text .lead { font-size: 1.375rem; font-weight: 600; color: var(--text-color); margin-bottom: 24px; }
                .about-text p { margin-bottom: 24px; color: var(--text-secondary); max-width: 800px; margin-inline: auto; }
                .about-stats { display: flex; gap: 60px; margin-bottom: 40px; flex-wrap: wrap; justify-content: center; }
                .stat { display: flex; flex-direction: column; align-items: center; }
                .stat .number { font-size: 2.5rem; font-weight: 800; color: var(--primary); }
                .stat .label { font-size: 0.875rem; color: var(--text-secondary); font-weight: 600; }

                @media (max-width: 768px) { 
                    .img-card { width: 280px; height: 350px; border-radius: 24px; }
                    .about-stats { gap: 40px; }
                    .stat .number { font-size: 2rem; }
                    .about-text .lead { font-size: 1.125rem; }
                }
                @media (max-width: 480px) {
                    .img-card { height: 300px; border-radius: 20px; }
                    .about-stats { gap: 24px; }
                }
            `}</style>
        </section>
    );
};

export default About;
