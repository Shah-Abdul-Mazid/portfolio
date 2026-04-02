import { useState } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link as LinkIcon } from 'lucide-react';
import { DocThumb, DocModal } from './DocViewer';

const Education = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const education = data.education;
    const [activeDoc, setActiveDoc] = useState<{ url: string; label: string } | null>(null);

    return (
        <section id="education" className="section">
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

                <div className="edu-card-stack">
                    {education.map((item, index) => (
                        <div key={index} className="edu-card fade-in" ref={addToRefs}>
                            <div className="edu-card-header">
                                <div className="edu-title-group">
                                    <h3 className="edu-title">{item.degree}</h3>
                                    <p  className="edu-school">{item.school}</p>
                                </div>
                                <div className="edu-meta">
                                    <span className="edu-period">{item.year}</span>
                                    <span className="edu-major">{item.major}</span>
                                </div>
                            </div>

                            <div className="edu-card-body">
                                <div className="edu-content">
                                    {item.attachmentUrl && (
                                        <a href={resolveUrl(item.attachmentUrl)} target="_blank" rel="noopener noreferrer" className="edu-attach-link">
                                            <LinkIcon size={11} /> Academic Transcript
                                        </a>
                                    )}
                                </div>

                                {item.certificateUrl && (
                                    <div className="edu-doc">
                                        <DocThumb
                                            url={item.certificateUrl}
                                            label="Certificate"
                                            color="green"
                                            onClick={() => setActiveDoc({ url: item.certificateUrl!, label: `${item.degree} – Certificate` })}
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
                .edu-card-stack { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                .edu-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 24px; border-radius: 18px; transition: var(--transition); }
                .edu-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(139,92,246,0.1); }

                .edu-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 20px; }
                .edu-title-group { min-width: 0; }
                .edu-title  { font-size: 1.1rem; color: #fff; margin: 0 0 4px; font-weight: 700; }
                .edu-school { color: var(--primary); font-weight: 700; font-size: 0.9rem; margin: 0; }

                .edu-meta   { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
                .edu-period { background: rgba(139,92,246,0.08); color: var(--primary); padding: 3px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(139,92,246,0.2); white-space: nowrap; }
                .edu-major  { font-size: 0.62rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

                .edu-card-body { display: flex; gap: 20px; align-items: flex-start; }
                .edu-content   { flex: 1; min-width: 0; }

                .edu-attach-link { display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.03); color: var(--text-muted); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; text-decoration: none; border: 1px solid var(--border-color); transition: all 0.2s; }
                .edu-attach-link:hover { color: var(--primary); border-color: var(--primary); }

                .edu-doc { flex-shrink: 0; }

                @media (max-width: 768px) {
                    .edu-card { padding: 16px; }
                    .edu-card-header { flex-direction: column; gap: 8px; }
                    .edu-meta { align-items: flex-start; }
                    .edu-card-body { flex-direction: column; gap: 14px; }
                }
            `}</style>
        </section>
    );
};

export default Education;
