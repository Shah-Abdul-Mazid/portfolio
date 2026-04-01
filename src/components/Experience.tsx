import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link as LinkIcon, FileText } from 'lucide-react';

const Experience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const competitions = data.experience;
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    return (
        <section id="achievements" className="section">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.experience?.subtitle || 'Achievements'}</span>
                    <h2>
                        {data.sections?.experience?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.experience.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Hackathons & <span className="gradient-text">Competitions</span></>
                        )}
                    </h2>
                </div>
                <div className="exp-grid">
                    {competitions.map((items, index) => (
                        <div key={index} className="exp-card fade-in" ref={addToRefs}>
                            <div className="exp-header">
                                <h3>{items.role}</h3>
                                <span className="period">{items.period}</span>
                            </div>
                            <div className="exp-body">
                                <div className="exp-main-content">
                                    <p className="company">{items.company}</p>
                                    <p className="desc">{items.desc}</p>
                                    
                                    {(items.attachmentUrl || items.certificateUrl) && (
                                        <div className="attachments-group">
                                            {items.certificateUrl && (
                                                <button onClick={() => setSelectedFile(items.certificateUrl as string)} className="attachment-link">
                                                    <FileText size={14} style={{ marginRight: '6px' }} />
                                                    Certificate
                                                </button>
                                            )}
                                            {items.attachmentUrl && (
                                                <a href={items.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                                    <LinkIcon size={14} style={{ marginRight: '6px' }} />
                                                    {items.attachmentLabel || 'View Document'}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {items.certificateUrl && (
                                    <div className="exp-preview" onClick={() => setSelectedFile(items.certificateUrl as string)}>
                                        <div className="preview-thumbnail">
                                            {items.certificateUrl.toLowerCase().endsWith('.pdf') ? (
                                                <div className="pdf-preview-card" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
                                                    <FileText size={32} />
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>PDF Certificate</span>
                                                </div>
                                            ) : (
                                                <img src={items.certificateUrl} alt="Achievement Preview" />
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
            <style>{`
                .exp-grid { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 800px; margin: 0 auto; }
                .exp-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 32px; border-radius: 20px; transition: var(--transition); }
                .exp-card:hover { border-color: var(--primary); }
                .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 12px; flex-wrap: wrap; }
                .exp-card .company { color: var(--primary); font-weight: 600; margin-bottom: 12px; }
                .exp-card .period { background: rgba(139, 92, 246, 0.1); padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 600; color: var(--primary); white-space: nowrap; flex-shrink: 0; }
                .exp-card .desc { color: var(--text-secondary); font-size: 0.9375rem; line-height: 1.7; }
                
                .exp-body { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
                .exp-main-content { flex: 1; min-width: 250px; }
                
                .exp-preview { flex-shrink: 0; width: 180px; cursor: pointer; }
                .preview-thumbnail { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); background: #000; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; }
                .preview-thumbnail img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
                .preview-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; z-index: 2; }
                .exp-preview:hover .preview-thumbnail img { transform: scale(1.1); }
                .exp-preview:hover .preview-overlay { opacity: 1; }
                .preview-overlay span { background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }
                .attachments-group { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
                .attachment-link { display: inline-flex; align-items: center; background: rgba(139, 92, 246, 0.08); color: var(--primary); padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(139, 92, 246, 0.15); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
                .attachment-link:hover { background: var(--primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
                .attachment-link svg { transition: transform 0.3s ease; }
                .attachment-link:hover svg { transform: scale(1.1); }
                
                .image-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; opacity: 0; animation: fadeIn 0.2s forwards; backdrop-filter: blur(5px); }
                .image-modal-content { position: relative; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center; }
                .close-modal-btn { position: absolute; top: -40px; right: 0; background: transparent; border: none; color: white; font-size: 28px; cursor: pointer; transition: transform 0.2s; }
                .close-modal-btn:hover { transform: scale(1.2); }
                .enlarged-image { max-width: 100%; max-height: 85vh; border-radius: 8px; display: block; box-shadow: 0 10px 40px rgba(0,0,0,0.5); object-fit: contain; }
                
                @keyframes fadeIn { to { opacity: 1; } }
            `}</style>
            
            {selectedFile && (
                <div className="image-modal-overlay" onClick={() => setSelectedFile(null)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>✕</button>
                        {selectedFile.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={selectedFile} className="enlarged-image" style={{ width: '80vw', height: '85vh', backgroundColor: '#fff', border: 'none', pointerEvents: 'auto' }} title="Document Viewer" />
                        ) : (
                            <img src={selectedFile} alt="Enlarged Document" className="enlarged-image" />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Experience;
