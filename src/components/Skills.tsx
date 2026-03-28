import { usePortfolio } from '../context/PortfolioContext';

const Skills = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const categories = data.skills;

    return (
        <section id="skills" className="section alt-bg" style={{ overflow: 'hidden' }}>
            <div className="container" style={{ maxWidth: '100%', padding: '0' }}>
                <div className="section-title fade-in" ref={addToRefs} style={{ paddingLeft: '24px', textAlign: 'center' }}>
                    <span className="subtitle">Technical Stack</span>
                    <h2>Core <span className="gradient-text">Expertise</span></h2>
                </div>
                
                <div className="skills-marquee-container">
                    <div className="skills-marquee">
                        {[...categories, ...categories].map((cat, index) => (
                            <div key={index} className="skills-group">
                                <h3>{cat.name}</h3>
                                <ul className="skill-list">
                                    {cat.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                .skills-marquee-container { 
                    margin-top: 60px; 
                    padding: 40px 0;
                    position: relative;
                }
                .skills-marquee { 
                    display: flex; 
                    gap: 40px; 
                    animation: slide 40s linear infinite; 
                    width: max-content;
                }
                .skills-group { 
                    background: var(--card-bg); 
                    border: 1px solid var(--border-color); 
                    padding: 40px; 
                    border-radius: 32px; 
                    min-width: 320px;
                    transition: var(--transition);
                }
                .skills-group:hover { border-color: var(--primary); transform: translateY(-10px); }
                .skills-group h3 { font-size: 1.125rem; color: var(--primary); margin-bottom: 24px; font-weight: 700; }
                .skill-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
                .skill-list li { color: var(--text-secondary); font-weight: 500; display: flex; align-items: center; gap: 8px; }
                .skill-list li::before { content: '•'; color: var(--primary); font-size: 1.5rem; }
                @keyframes slide {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .skills-marquee:hover { animation-play-state: paused; }
            `}</style>
        </section>
    );
};

export default Skills;
