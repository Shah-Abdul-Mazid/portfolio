import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { calculateWorkDuration, formatDateLabel, sortRecentFirst } from '../utils/dateUtils';
import { Award, Link as LinkIcon, FileCheck, FileText } from 'lucide-react';

const WorkExperience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const workHistory = sortRecentFirst(data.work || []);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

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
                                <div className="work-body">
                                    <div className="work-main-content">
                                        <ul className="work-details">
                                            {job.details.map((detail, i) => (
                                                <li key={i}>{detail}</li>
                                            ))}
                                        </ul>
                                        
                                        {(job.attachmentUrl || job.appointmentLetterUrl || job.certificateUrl) && (
                                            <div className="attachments-group">
                                                {job.appointmentLetterUrl && (
                                                    <button onClick={() => setSelectedFile(job.appointmentLetterUrl as string)} className="attachment-link">
                                                        <FileCheck size={14} style={{ marginRight: '6px' }} />
                                                        Appointment Letter
                                                    </button>
                                                )}
                                                {job.certificateUrl && (
                                                    <button onClick={() => setSelectedFile(job.certificateUrl as string)} className="attachment-link">
                                                        <Award size={14} style={{ marginRight: '6px' }} />
                                                        Experience Certificate
                                                    </button>
                                                )}
                                                {job.attachmentUrl && (
                                                    <a href={job.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                                                        <LinkIcon size={14} style={{ marginRight: '6px' }} />
                                                        {job.attachmentLabel || 'View Document'}
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {(job.certificateUrl || job.appointmentLetterUrl) && (
                                        <div className="work-preview" onClick={() => setSelectedFile((job.certificateUrl || job.appointmentLetterUrl) as string)}>
                                            <div className="preview-thumbnail">
                                                {(job.certificateUrl || job.appointmentLetterUrl)?.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="pdf-preview-card" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
                                                        <FileText size={32} />
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>PDF Document</span>
                                                    </div>
                                                ) : (
                                                    <img src={job.certificateUrl || job.appointmentLetterUrl} alt="Experience Preview" />
                                                )}
                                                <div className="preview-overlay">
                                                    <span>🔍 View</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
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

                .work-body { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
                .work-main-content { flex: 1; min-width: 280px; }
                
                .work-preview { flex-shrink: 0; width: 200px; cursor: pointer; }
                .preview-thumbnail { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); background: #000; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; }
                .preview-thumbnail img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
                .preview-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; z-index: 2; }
                .work-preview:hover .preview-thumbnail img { transform: scale(1.1); }
                .work-preview:hover .preview-overlay { opacity: 1; }
                .preview-overlay span { background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }

                .attachments-group { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
                .attachment-link { 
                    display: inline-flex; 
                    align-items: center; 
                    background: rgba(139, 92, 246, 0.1); 
                    color: var(--primary); 
                    padding: 8px 16px; 
                    border-radius: 12px; 
                    font-size: 0.85rem; 
                    font-weight: 600; 
                    text-decoration: none; 
                    border: 1px solid rgba(139, 92, 246, 0.2); 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                    cursor: pointer; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .attachment-link:hover { 
                    background: var(--primary); 
                    color: white; 
                    transform: translateY(-2px); 
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); 
                }
                .attachment-link svg { transition: transform 0.3s ease; }
                .attachment-link:hover svg { transform: scale(1.1); }

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

export default WorkExperience;
