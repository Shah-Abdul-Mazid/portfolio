import { usePortfolio } from '../context/PortfolioContext';

const Education = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const education = data.education;

    return (
        <section id="education" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.education?.subtitle || 'Education'}</span>
                    <h2>
                        {data.sections?.education?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.education.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>My Academic <span className="gradient-text">Journey</span></>
                        )}
                    </h2>
                </div>
                <div className="timeline">
                    {education.map((item, index) => (
                        <div key={index} className="timeline-item fade-in" ref={addToRefs}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h3>{item.degree}</h3>
                                <p className="school">{item.school}</p>
                                <p className="major">{item.major}</p>
                                <p className="year">{item.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .timeline { position: relative; max-width: 800px; margin: 0 auto; padding: 40px 0; }
                .timeline::before { content: ''; position: absolute; left: 0; top: 0; width: 2px; height: 100%; background: var(--border-color); }
                .timeline-item { position: relative; padding-left: 40px; margin-bottom: 40px; }
                .timeline-dot { position: absolute; left: -5px; top: 8px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
                .timeline-content h3 { font-size: 1.25rem; margin-bottom: 4px; }
                .timeline-content .school { color: var(--primary); font-weight: 600; }
                .timeline-content .major { font-size: 0.9375rem; color: var(--text-color); margin-bottom: 4px; }
                .timeline-content .year { font-size: 0.875rem; color: var(--text-secondary); }
            `}</style>
        </section>
    );
};

export default Education;
