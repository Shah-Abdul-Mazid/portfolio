import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const Papers = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const papers = data.papers || [];
    const [showAll, setShowAll] = useState(false);

    if (papers.length === 0) return null;

    const displayedPapers = showAll ? papers : papers.slice(0, 8);

    return (
        <section id="papers" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">Publications</span>
                    <h2>Research <span className="gradient-text">Papers</span></h2>
                </div>
                <div className="papers-grid">
                    {displayedPapers.map((paper, index) => (
                        <div key={index} className="paper-card fade-in" ref={addToRefs}>
                            <div className="paper-content">
                                <div className="paper-meta">
                                    <span className="year">{paper.year}</span>
                                    {paper.venue && <span className="venue">{paper.venue}</span>}
                                </div>
                                <h3 className="paper-title">{paper.title}</h3>
                                <p className="paper-authors">{paper.authors}</p>
                                
                                {paper.keywords && (
                                    <div className="paper-keywords">
                                        {paper.keywords.split(';').map((kw, i) => kw.trim() ? (
                                            <span key={i} className="keyword-tag">{kw.trim()}</span>
                                        ) : null).slice(0, 4)}
                                    </div>
                                )}
                            </div>
                            {paper.doi && (
                                <a href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`} 
                                   target="_blank" rel="noreferrer" className="paper-doi-btn">
                                    <span>Read Paper</span>
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
                {papers.length > 8 && (
                    <div className="fade-in" style={{ textAlign: 'center', marginTop: '40px' }} ref={addToRefs}>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setShowAll(!showAll)} 
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '100px', cursor: 'pointer', transition: 'var(--transition)' }}
                        >
                            {showAll ? 'Show Less Papers' : `View All ${papers.length} Papers`}
                            {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                .papers-grid { 
                    display: grid; 
                    grid-template-columns: repeat(4, 1fr); 
                    gap: 16px; 
                }
                .paper-card { 
                    background: var(--card-bg); 
                    border: 1px solid var(--border-color); 
                    border-radius: 12px; 
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden; 
                    transition: var(--transition); 
                    position: relative;
                }
                .paper-card:hover { 
                    transform: translateY(-6px); 
                    border-color: var(--primary); 
                    box-shadow: 0 10px 30px rgba(59,130,246,0.1);
                }
                .paper-content { 
                    padding: 16px; 
                }
                .paper-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-size: 0.70rem;
                    color: var(--text-secondary);
                    flex-wrap: wrap;
                }
                .paper-meta .year {
                    background: rgba(59,130,246,0.1);
                    color: var(--primary);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 700;
                }
                .paper-meta .venue {
                    font-style: italic;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 140px;
                }
                .paper-title { 
                    font-size: 0.95rem; 
                    line-height: 1.3;
                    margin-bottom: 8px; 
                    color: var(--text-main);
                }
                .paper-authors { 
                    font-size: 0.8rem; 
                    color: var(--text-secondary); 
                    margin-bottom: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .paper-keywords {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-bottom: 12px;
                }
                .keyword-tag {
                    font-size: 0.65rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 2px 6px;
                    border-radius: 100px;
                    color: var(--text-muted);
                }
                .paper-doi-btn {
                    margin: 0 16px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: var(--primary);
                    color: white;
                    padding: 8px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .paper-doi-btn:hover {
                    background: var(--primary-dark);
                    transform: scale(1.02);
                }
                
                @media (max-width: 1200px) {
                    .papers-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 900px) {
                    .papers-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .papers-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </section>
    );
};

export default Papers;
