import { usePortfolio } from '../context/PortfolioContext';
import { calculateWorkDuration, formatDateLabel, sortRecentFirst } from '../utils/dateUtils';

const WorkExperience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const workHistory = sortRecentFirst(data.work || []);

    return (
        <section id="work" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">Career Journey</span>
                    <h2>Professional <span className="gradient-text">Experience</span></h2>
                </div>
                
                <div className="work-timeline">
                    {workHistory.map((job, index) => (
                        <div key={index} className="work-item fade-in" ref={addToRefs}>
                            <div className="work-marker">
                                <div className="marker-dot"></div>
                                <div className="marker-line"></div>
                            </div>
                            <div className="work-content">
                                <div className="work-header">
                                    <div className="work-title-group">
                                        <h3>{job.role}</h3>
                                        <p className="company-name">{job.company}</p>
                                    </div>
                                    <div className="work-time-info">
                                        <span className="work-period">
                                            {formatDateLabel(job.startDate)} – {formatDateLabel(job.endDate)}
                                        </span>
                                        <span className="work-duration">
                                            {calculateWorkDuration(job.startDate, job.endDate)}
                                        </span>
                                    </div>
                                </div>
                                <ul className="work-details">
                                    {job.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .work-timeline { position: relative; max-width: 900px; margin: 0 auto; padding-top: 20px; }
                .work-item { display: flex; gap: 40px; margin-bottom: 60px; position: relative; }
                .work-item:last-child { margin-bottom: 0; }
                
                .work-marker { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
                .marker-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 15px var(--primary-glow); z-index: 2; border: 3px solid var(--bg-color); }
                .marker-line { width: 2px; flex: 1; background: linear-gradient(to bottom, var(--primary), transparent); margin-top: 10px; margin-bottom: -60px; }
                .work-item:last-child .marker-line { display: none; }

                .work-content { flex: 1; background: var(--card-bg); border: 1px solid var(--border-color); padding: 32px; border-radius: 24px; transition: var(--transition); position: relative; }
                .work-content:hover { border-color: var(--primary); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                
                .work-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 20px; }
                .work-title-group h3 { font-size: 1.5rem; color: var(--text-color); margin-bottom: 4px; }
                .company-name { color: var(--primary); font-weight: 700; font-size: 1.1rem; }
                
                .work-time-info { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
                .work-period { background: rgba(139, 92, 246, 0.1); color: var(--primary); padding: 6px 14px; border-radius: 100px; font-size: 0.85rem; font-weight: 700; white-space: nowrap; border: 1px solid rgba(139, 92, 246, 0.2); }
                .work-duration { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

                .work-details { list-style: none; padding: 0; }
                .work-details li { position: relative; padding-left: 24px; margin-bottom: 12px; color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }
                .work-details li::before { content: '→'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }

                @media (max-width: 768px) {
                    .work-item { gap: 16px; }
                    .work-header { flex-direction: column; align-items: flex-start; gap: 10px; }
                    .work-title-group h3 { font-size: 1.125rem; }
                    .work-content { padding: 20px; }
                    .work-time-info { align-items: flex-start; }
                }
                @media (max-width: 480px) {
                    .work-timeline { padding-top: 10px; }
                    .work-marker { width: 14px; }
                    .marker-dot { width: 12px; height: 12px; }
                    .work-item { gap: 12px; margin-bottom: 40px; }
                    .work-content { padding: 18px 16px; border-radius: 18px; }
                    .work-details li { font-size: 0.875rem; padding-left: 20px; }
                    .work-period { font-size: 0.75rem; padding: 5px 10px; }
                    .company-name { font-size: 0.95rem; }
                }
            `}</style>
        </section>
    );
};

export default WorkExperience;
