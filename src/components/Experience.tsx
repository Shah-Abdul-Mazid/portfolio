import { useState } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link as LinkIcon } from 'lucide-react';
import { DocThumb, DocModal } from './DocViewer';

const Experience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const competitions = data.experience;
    const [activeDoc, setActiveDoc] = useState<{ url: string; label: string } | null>(null);

    return (
        <section id="achievements" className="section">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.experience?.subtitle || 'Achievements'}</span>
                    <h2>
                        {data.sections?.experience?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.experience.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Hackathons &amp; <span className="gradient-text">Competitions</span></>
                        )}
                    </h2>
                </div>

                <div className="exp-card-stack">
                    {competitions.map((item, index) => (
                        <div key={index} className="exp-card fade-in" ref={addToRefs}>
                            <div className="exp-card-header">
                                <div className="exp-title-group">
                                    <h3 className="exp-title">{item.role}</h3>
                                    <p  className="exp-company">{item.company}</p>
                                </div>
                                <div className="exp-meta">
                                    <span className="exp-period">{item.period}</span>
                                </div>
                            </div>

                            <div className="exp-card-body">
                                <div className="exp-content">
                                    <p className="exp-desc">{item.desc}</p>
                                    {item.attachmentUrl && (
                                        <div style={{ marginTop: '10px' }}>
                                            <a href={resolveUrl(item.attachmentUrl)} target="_blank" rel="noopener noreferrer" className="exp-attach-link">
                                                <LinkIcon size={11} /> Original Proof
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {item.certificateUrl && (
                                    <div className="exp-doc">
                                        <DocThumb
                                            url={item.certificateUrl}
                                            label="Certificate"
                                            color="purple"
                                            onClick={() => setActiveDoc({ url: item.certificateUrl!, label: `${item.role} – Certificate` })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
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
                .exp-card-stack { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                .exp-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 24px; border-radius: 18px; transition: var(--transition); }
                .exp-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(139,92,246,0.1); }

                .exp-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 20px; }
                .exp-title-group { min-width: 0; }
                .exp-title   { font-size: 1.1rem; color: #fff; margin: 0 0 4px; font-weight: 700; }
                .exp-company { color: var(--primary); font-weight: 700; font-size: 0.9rem; margin: 0; }
                .exp-meta    { flex-shrink: 0; }
                .exp-period  { background: rgba(139,92,246,0.08); color: var(--primary); padding: 3px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(139,92,246,0.2); white-space: nowrap; }

                .exp-card-body { display: flex; gap: 20px; align-items: flex-start; }
                .exp-content   { flex: 1; min-width: 0; }
                .exp-desc      { color: var(--text-secondary); font-size: 0.88rem; line-height: 1.7; margin: 0; }

                .exp-attach-link { display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.03); color: var(--text-muted); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; text-decoration: none; border: 1px solid var(--border-color); transition: all 0.2s; }
                .exp-attach-link:hover { color: var(--primary); border-color: var(--primary); }

                .exp-doc { flex-shrink: 0; }

                @media (max-width: 768px) {
                    .exp-card { padding: 16px; }
                    .exp-card-header { flex-direction: column; gap: 8px; }
                    .exp-card-body   { flex-direction: column; gap: 14px; }
                }
            `}</style>
        </section>
    );
};

export default Experience;
