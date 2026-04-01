import { useState } from 'react';
import type { MouseEvent } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Link as LinkIcon, FileText } from 'lucide-react';

const Education = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const education = data.education;
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const closeModal = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setSelectedFile(null);
        }
    };

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
                                <div className="edu-main-info">
                                    <h3>{item.degree}</h3>
                                    <p className="school">{item.school}</p>
                                    <p className="major">{item.major}</p>
                                    <p className="year">{item.year}</p>
                                    
                                    {(item.attachmentUrl || item.certificateUrl) && (
                                        <div className="attachments-group">
                                            {item.certificateUrl && (
                                                <button onClick={() => setSelectedFile(item.certificateUrl as string)} className="attachment-link">
                                                    <Award size={14} style={{ marginRight: '6px' }} />
                                                    Certificate
                                                </button>
                                            )}
                                            {item.attachmentUrl && (
                                                <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                                    <LinkIcon size={14} style={{ marginRight: '6px' }} />
                                                    {item.attachmentLabel || 'View Document'}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {item.certificateUrl && (
                                    <div className="edu-preview" onClick={() => setSelectedFile(item.certificateUrl as string)}>
                                        <div className="preview-thumbnail">
                                            {item.certificateUrl.toLowerCase().endsWith('.pdf') ? (
                                                <div className="pdf-preview-card" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
                                                    <FileText size={32} />
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>PDF Certificate</span>
                                                </div>
                                            ) : (
                                                <img src={item.certificateUrl} alt="Certificate Preview" />
                                            )}
                                            <div className="preview-overlay">
                                                <span>🔍 View</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedFile && (
                <div className="image-modal-overlay" onClick={closeModal}>
                    <div className="image-modal-content">
                        <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>✖</button>
                        {selectedFile.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={selectedFile} className="pdf-viewer" title="Document Viewer" />
                        ) : (
                            <img src={selectedFile} alt="Fullscreen View" className="fullscreen-image" />
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .timeline { position: relative; max-width: 900px; margin: 0 auto; padding: 40px 0; }
                .timeline::before { content: ''; position: absolute; left: 0; top: 0; width: 2px; height: 100%; background: var(--border-color); }
                .timeline-item { position: relative; padding-left: 40px; margin-bottom: 40px; }
                .timeline-dot { position: absolute; left: -5px; top: 8px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
                .timeline-content {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    gap: 24px;
                    align-items: flex-start;
                    flex-wrap: wrap;
                }
                .timeline-content:hover { border-color: var(--primary); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .edu-main-info { flex: 1; min-width: 250px; }
                .timeline-content h3 { font-size: 1.25rem; margin-bottom: 4px; }
                .timeline-content .school { color: var(--primary); font-weight: 600; margin-bottom: 4px; }
                .timeline-content .major { font-size: 0.9375rem; color: var(--text-color); margin-bottom: 4px; }
                .timeline-content .year { font-size: 0.875rem; color: var(--text-secondary); }
                .attachments-group { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
                .attachment-link { display: inline-flex; align-items: center; background: rgba(139, 92, 246, 0.08); color: var(--primary); padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(139, 92, 246, 0.15); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
                .attachment-link:hover { background: var(--primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
                .attachment-link svg { transition: transform 0.3s ease; }
                .attachment-link:hover svg { transform: scale(1.1); }

                .edu-preview { flex-shrink: 0; width: 180px; cursor: pointer; }
                .preview-thumbnail { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); background: #000; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; }
                .preview-thumbnail img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
                .preview-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; z-index: 2; }
                .edu-preview:hover .preview-thumbnail img { transform: scale(1.1); }
                .edu-preview:hover .preview-overlay { opacity: 1; }
                .preview-overlay span { background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }

                /* Fullscreen Image/PDF Modal */
                .image-modal-overlay { position: fixed; inset: 0; background: rgba(3,7,18,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 40px; animation: modalFadeIn 0.3s ease-out; }
                .image-modal-content { position: relative; max-width: 1200px; width: 100%; max-height: 90vh; background: #0f172a; border-radius: 16px; padding: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); display: flex; flex-direction: column; }
                .close-modal-btn { position: absolute; top: -16px; right: -16px; width: 32px; height: 32px; background: #ef4444; color: white; border: none; border-radius: 50%; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10000; box-shadow: 0 4px 12px rgba(239,68,68,0.4); transition: transform 0.2s; }
                .close-modal-btn:hover { transform: scale(1.1); }
                .fullscreen-image { width: 100%; height: 100%; max-height: calc(90vh - 24px); object-fit: contain; border-radius: 8px; }
                .pdf-viewer { width: 100%; height: calc(90vh - 24px); border: none; border-radius: 8px; background: white; }
                @keyframes modalFadeIn { from { opacity: 0; backdrop-filter: blur(0); } to { opacity: 1; backdrop-filter: blur(8px); } }
                
                @media (max-width: 768px) {
                    .timeline-content { flex-direction: column; gap: 16px; }
                    .edu-documents-container { width: 100%; display: flex; justify-content: flex-start; }
                    .certificate-thumbnail-container { align-items: flex-start; }
                    .certificate-label { text-align: left; margin-bottom: 6px; }
                    .image-modal-overlay { padding: 16px; }
                }
            `}</style>
        </section>
    );
};

export default Education;
