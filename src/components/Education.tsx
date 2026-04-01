import { useState } from 'react';
import type { MouseEvent } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
<<<<<<< HEAD
import { Link as LinkIcon, FileText } from 'lucide-react';
=======
import { FileText, ExternalLink, Link as LinkIcon } from 'lucide-react';
>>>>>>> edf6201f2eceb9556137232946572e647a7a1d4c

const Education = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const education = data.education;
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const isImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);

    const closeModal = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setSelectedFile(null);
        }
    };

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
                <div className="card-stack">
                    {education.map((item, index) => (
<<<<<<< HEAD
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
                                                    <FileText size={14} style={{ marginRight: '6px' }} />
                                                    Certificate
                                                </button>
                                            )}
                                            {item.attachmentUrl && (
                                                <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                                    <LinkIcon size={14} style={{ marginRight: '6px' }} />
                                                    {item.attachmentLabel || 'View Document'}
                                                </a>
                                            )}
=======
                        <div key={index} className="unified-card fade-in" ref={addToRefs}>
                            <div className="card-header">
                                <div className="card-title-group">
                                    <h3 className="card-title">{item.degree}</h3>
                                    <p className="card-subtitle">{item.school}</p>
                                </div>
                                <div className="card-meta">
                                    <span className="card-period">{item.year}</span>
                                    <span className="card-duration">{item.major}</span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-content">
                                    {item.attachmentUrl && (
                                        <div className="card-actions" style={{ marginTop: '12px' }}>
                                            <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                                <LinkIcon size={12} style={{ marginRight: '6px' }} />
                                                Academic Transcript
                                            </a>
>>>>>>> edf6201f2eceb9556137232946572e647a7a1d4c
                                        </div>
                                    )}
                                </div>
                                
                                {item.certificateUrl && (
                                    <div className="card-previews">
                                        <div className="mini-thumbnail" onClick={() => setSelectedFile(item.certificateUrl as string)}>
                                            {isImage(item.certificateUrl) ? (
                                                <img src={item.certificateUrl} alt="Certificate" />
                                            ) : (
                                                <div className="mini-pdf-tag"><FileText size={16} /></div>
                                            )}
                                            <div className="thumbnail-overlay"><ExternalLink size={14} /></div>
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
                .card-stack { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                .unified-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 24px; border-radius: 16px; transition: var(--transition); position: relative; }
                .unified-card:hover { border-color: var(--primary); transform: translateY(-2px); }
                
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 20px; }
                .card-title { font-size: 1.2rem; color: #fff; margin: 0 0 4px 0; font-weight: 700; }
                .card-subtitle { color: var(--primary); font-weight: 700; font-size: 0.95rem; margin: 0; }
                
                .card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
                .card-period { background: rgba(139,92,246,0.08); color: var(--primary); padding: 2px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(139,92,246,0.2); }
                .card-duration { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

                .card-body { display: flex; gap: 24px; align-items: center; justify-content: space-between; }
                .card-content { flex: 1; min-width: 250px; }
                .attachment-link { display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); color: var(--text-muted); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; text-decoration: none; border: 1px solid var(--border-color); transition: all 0.3s; }
                .attachment-link:hover { color: var(--primary); border-color: var(--primary); background: rgba(139,92,246,0.05); }

                .card-previews { display: flex; gap: 10px; flex-shrink: 0; }
                .mini-thumbnail { position: relative; width: 60px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background: #000; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .mini-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .mini-pdf-tag { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: #ef4444; color: white; }
                .thumbnail-overlay { position: absolute; inset: 0; background: rgba(139,92,246,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; color: white; }
                .mini-thumbnail:hover { border-color: var(--primary); scale: 1.05; }
                .mini-thumbnail:hover .thumbnail-overlay { opacity: 1; }

                .image-modal-overlay { position: fixed; inset: 0; background: rgba(3,7,18,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 40px; }
                .image-modal-content { position: relative; max-width: 900px; width: 100%; max-height: 85vh; background: #0f172a; border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.1); }
                .close-modal-btn { position: absolute; top: -12px; right: -12px; width: 28px; height: 28px; background: #ef4444; color: white; border: none; border-radius: 50%; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10000; }
                .fullscreen-image { width: 100%; height: 100%; max-height: calc(85vh - 20px); object-fit: contain; }
                .pdf-viewer { width: 100%; height: calc(85vh - 20px); border: none; border-radius: 6px; background: white; }

                @media (max-width: 768px) {
                    .unified-card { padding: 16px; }
                    .card-header { flex-direction: column; gap: 8px; }
                    .card-meta { align-items: flex-start; }
                    .card-body { flex-direction: column-reverse; align-items: flex-start; gap: 16px; }
                    .mini-thumbnail { width: 50px; height: 65px; }
                }
            `}</style>
        </section>
    );
};

export default Education;
