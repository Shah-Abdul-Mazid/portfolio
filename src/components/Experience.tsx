import { usePortfolio } from '../context/PortfolioContext';

const Experience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const competitions = data.experience;

    return (
        <section id="achievements" className="section">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">Achievements</span>
                    <h2>Hackathons & <span className="gradient-text">Competitions</span></h2>
                </div>
                <div className="exp-grid">
                    {competitions.map((items, index) => (
                        <div key={index} className="exp-card fade-in" ref={addToRefs}>
                            <div className="exp-header">
                                <h3>{items.role}</h3>
                                <span className="period">{items.period}</span>
                            </div>
                            <p className="company">{items.company}</p>
                            <p className="desc">{items.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .exp-grid { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 800px; margin: 0 auto; }
                .exp-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 32px; border-radius: 20px; transition: var(--transition); }
                .exp-card:hover { border-color: var(--primary); }
                .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 12px; flex-wrap: wrap; }
                .exp-card .company { color: var(--primary); font-weight: 600; margin-bottom: 12px; }
                .exp-card .period { background: rgba(139, 92, 246, 0.1); padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 600; color: var(--primary); white-space: nowrap; flex-shrink: 0; }
                .exp-card .desc { color: var(--text-secondary); font-size: 0.9375rem; line-height: 1.7; }
                @media (min-width: 769px) {
                    .exp-card:hover { transform: translateX(8px); }
                }
                @media (max-width: 600px) {
                    .exp-card { padding: 24px 20px; }
                    .exp-card h3 { font-size: 1rem; }
                }
            `}</style>
        </section>
    );
};

export default Experience;
