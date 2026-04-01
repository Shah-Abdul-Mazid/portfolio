import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { calculateWorkDuration, formatDateLabel, sortRecentFirst } from '../utils/dateUtils';
import { Award, FileText, ExternalLink } from 'lucide-react';

const WorkExperience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const workHistory = sortRecentFirst(data.work || []);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const isImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);

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
                
                <div className="card-stack">
                    {workHistory.map((job, index) => (
                        <div key={index} className="unified-card fade-in" ref={addToRefs}>
                            <div className="card-header">
                                <div className="card-title-group">
                                    <h3 className="card-title">{job.role}</h3>
                                    <p className="card-subtitle">{job.company}</p>
                                </div>
                                <div className="card-meta">
                                    <span className="card-period">{formatDateLabel(job.startDate)} – {formatDateLabel(job.endDate)}</span>
                                    <span className="card-duration">{calculateWorkDuration(job.startDate, job.endDate)}</span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-content">
                                    <ul className="card-list">
                                        {job.details.map((detail, i) => (
                                            <li key={i}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="card-previews">
                                    {job.appointmentLetterUrl && (
                                        <div className="mini-thumbnail" onClick={() => setSelectedFile(job.appointmentLetterUrl as string)}>
                                            {isImage(job.appointmentLetterUrl) ? (
                                                <img src={job.appointmentLetterUrl} alt="Document" />
                                            ) : (
                                                <div className="mini-pdf-tag"><FileText size={12} /></div>
                                            )}
                                            <div className="thumbnail-overlay"><ExternalLink size={12} /></div>
                                        </div>
                                    )}
                                    {job.experienceLetterUrl && (
                                        <div className="mini-thumbnail blue" onClick={() => setSelectedFile(job.experienceLetterUrl as string)}>
                                            {isImage(job.experienceLetterUrl) ? (
                                                <img src={job.experienceLetterUrl} alt="Document" />
                                            ) : (
                                                <div className="mini-pdf-tag blue"><Award size={12} /></div>
                                            )}
                                            <div className="thumbnail-overlay"><ExternalLink size={12} /></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedFile && (
                <div className="image-modal-overlay" onClick={() => setSelectedFile(null)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>✖</button>
                        {selectedFile.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={selectedFile} className="pdf-viewer" title="Document Viewer" />
                        ) : (
                            <img src={selectedFile} alt="Full View" className="fullscreen-image" />
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .card-stack { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                .unified-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 24px; border-radius: 16px; transition: var(--transition); position: relative; }
                .unified-card:hover { border-color: var(--primary); transform: translateY(-2px); }
                
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 20px; }
                .card-title { font-size: 1.2rem; color: #fff; margin: 0 0 4px 0; font-weight: 700; }
                .card-subtitle { color: var(--primary); font-weight: 700; font-size: 0.95rem; margin: 0; }
                
                .card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
                .card-period { background: rgba(139,92,246,0.08); color: var(--primary); padding: 2px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(139,92,246,0.2); }
                .card-duration { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

                .card-body { display: flex; gap: 24px; align-items: flex-start; justify-content: space-between; }
                .card-content { flex: 1; }
                .card-list { list-style: none; padding: 0; margin: 0; }
                .card-list li { position: relative; padding-left: 18px; margin-bottom: 8px; color: var(--text-secondary); line-height: 1.6; font-size: 0.88rem; }
                .card-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }

                .card-previews { display: flex; gap: 10px; flex-shrink: 0; }
                .mini-thumbnail { position: relative; width: 60px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background: #000; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .mini-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .mini-pdf-tag { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: #ef4444; color: white; }
                .mini-pdf-tag.blue { background: #3b82f6; }
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
                    .card-header { flex-direction: column; gap: 10px; }
                    .card-meta { align-items: flex-start; }
                    .card-body { flex-direction: column-reverse; gap: 16px; }
                    .mini-thumbnail { width: 50px; height: 65px; }
                }
            `}</style>
        </section>
    );
};

export default WorkExperience;
