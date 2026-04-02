import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { calculateWorkDuration, formatDateLabel, sortRecentFirst } from '../utils/dateUtils';
import { DocThumb, DocModal } from './DocViewer';

interface DocEntry { url: string; label: string; color: 'purple' | 'blue'; }

const WorkExperience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const workHistory = sortRecentFirst(data.work || []);
    const [activeDoc, setActiveDoc] = useState<DocEntry | null>(null);

    return (
        <section id="work" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.work?.subtitle || 'Career Journey'}</span>
                    <h2>
                        {data.sections?.work?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.work.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Professional <span className="gradient-text">Experience</span></>
                        )}
                    </h2>
                </div>

                <div className="we-card-stack">
                    {workHistory.map((job, index) => {
                        const docs: DocEntry[] = [];
                        if (job.appointmentLetterUrl) docs.push({ url: job.appointmentLetterUrl, label: 'Appointment Letter', color: 'purple' });
                        if (job.experienceLetterUrl)  docs.push({ url: job.experienceLetterUrl,  label: 'Experience Letter',  color: 'blue' });

                        return (
                            <div key={index} className="we-card fade-in" ref={addToRefs}>
                                <div className="we-card-header">
                                    <div className="we-title-group">
                                        <h3 className="we-title">{job.role}</h3>
                                        <p  className="we-company">{job.company}</p>
                                    </div>
                                    <div className="we-meta">
                                        <span className="we-period">{formatDateLabel(job.startDate)} – {formatDateLabel(job.endDate)}</span>
                                        <span className="we-duration">{calculateWorkDuration(job.startDate, job.endDate)}</span>
                                    </div>
                                </div>

                                <div className="we-card-body">
                                    <div className="we-details">
                                        <ul className="we-list">
                                            {job.details.map((d, i) => <li key={i}>{d}</li>)}
                                        </ul>
                                    </div>

                                    {docs.length > 0 && (
                                        <div className="we-docs">
                                            {docs.map(doc => (
                                                <DocThumb
                                                    key={doc.url}
                                                    url={doc.url}
                                                    label={doc.label}
                                                    color={doc.color}
                                                    onClick={() => setActiveDoc(doc)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {activeDoc && (
                <DocModal
                    url={activeDoc.url}
                    label={activeDoc.label}
                    onClose={() => setActiveDoc(null)}
                />
            )}

            <style>{`
                .we-card-stack { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                .we-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 24px; border-radius: 18px; transition: var(--transition); }
                .we-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(139,92,246,0.1); }

                .we-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 20px; }
                .we-title-group { min-width: 0; }
                .we-title   { font-size: 1.15rem; color: #fff; margin: 0 0 4px; font-weight: 700; }
                .we-company { color: var(--primary); font-weight: 700; font-size: 0.9rem; margin: 0; }

                .we-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
                .we-period   { background: rgba(139,92,246,0.08); color: var(--primary); padding: 3px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(139,92,246,0.2); white-space: nowrap; }
                .we-duration { font-size: 0.62rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

                .we-card-body { display: flex; gap: 24px; align-items: flex-start; }
                .we-details  { flex: 1; min-width: 0; }
                .we-list     { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
                .we-list li  { position: relative; padding-left: 16px; color: var(--text-secondary); line-height: 1.6; font-size: 0.87rem; }
                .we-list li::before { content: '▸'; position: absolute; left: 0; color: var(--primary); font-size: 0.75rem; top: 2px; }

                .we-docs { display: flex; gap: 10px; flex-shrink: 0; align-items: flex-start; padding-top: 2px; }

                @media (max-width: 768px) {
                    .we-card { padding: 16px; }
                    .we-card-header { flex-direction: column; gap: 10px; }
                    .we-meta { align-items: flex-start; }
                    .we-card-body { flex-direction: column; gap: 16px; }
                    .we-docs { flex-direction: row; }
                }
            `}</style>
        </section>
    );
};

export default WorkExperience;
