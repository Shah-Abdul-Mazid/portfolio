import { usePortfolio } from '../context/PortfolioContext';

const Activities = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const activities = data.activities || [];

    if (activities.length === 0) return null;

    return (
        <section id="activities" className="section bg-light">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.activities?.subtitle || 'Involvement'}</span>
                    <h2>
                        {data.sections?.activities?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.activities.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Extracurricular <span className="gradient-text">Activities</span></>
                        )}
                    </h2>
                </div>
                <div className="activities-grid">
                    {activities.map((item, index) => (
                        <div key={index} className="activity-card fade-in" ref={addToRefs}>
                            <div className="activity-header">
                                <h3>{item.role}</h3>
                                <span className="period">{item.period}</span>
                            </div>
                            <p className="organization">{item.organization}</p>
                            <p className="desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .activities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-top: 40px; }
                .activity-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 32px; transition: var(--transition); display: flex; flex-direction: column; position: relative; overflow: hidden; }
                .activity-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, var(--primary), var(--secondary)); opacity: 0; transition: var(--transition); }
                .activity-card:hover { transform: translateY(-5px); border-color: rgba(139, 92, 246, 0.3); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
                .activity-card:hover::before { opacity: 1; }
                .activity-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 16px; }
                .activity-header h3 { font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0; }
                .period { background: rgba(139, 92, 246, 0.1); color: var(--primary); padding: 4px 12px; border-radius: 100px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
                .organization { font-size: 1rem; color: var(--primary); font-weight: 600; margin-bottom: 16px; }
                .desc { color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; margin: 0; flex: 1; }
            `}</style>
        </section>
    );
};

export default Activities;
