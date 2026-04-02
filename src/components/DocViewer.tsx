/**
 * DocViewer – shared document thumbnail + fullscreen viewer
 *
 * Usage:
 *   <DocThumb url="/data/cert.pdf" label="Certificate" color="purple" onClick={() => setOpen(true)} />
 *   <DocModal url="/data/cert.pdf" label="Certificate" onClose={() => setOpen(false)} />
 */
import { useState } from 'react';
import { resolveUrl } from '../context/PortfolioContext';
import { FileText, ImageIcon, X, ExternalLink, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

/* ─────────────── helpers ─────────────── */
export const isImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url);
export const isPdf   = (url: string) => /\.pdf$/i.test(url);

/** Embed URL – uses Google Docs viewer for full cross-browser PDF support */
const embedUrl = (raw: string) => {
    const resolved = resolveUrl(raw);
    if (isPdf(raw)) {
        // Absolute URL required by Google Docs viewer
        const abs = resolved.startsWith('http')
            ? resolved
            : `${window.location.origin}${resolved}`;
        return `https://docs.google.com/viewer?url=${encodeURIComponent(abs)}&embedded=true`;
    }
    return resolved;
};

/* ─────────────── DocThumb ─────────────── */
interface DocThumbProps {
    url: string;
    label: string;
    color?: 'purple' | 'blue' | 'green' | 'amber';
    onClick: () => void;
}

const COLORS: Record<string, string> = {
    purple: '#8b5cf6',
    blue:   '#3b82f6',
    green:  '#10b981',
    amber:  '#f59e0b',
};

export const DocThumb = ({ url, label, color = 'purple', onClick }: DocThumbProps) => {
    const accent = COLORS[color] ?? COLORS.purple;
    const img    = isImage(url);
    const pdf    = isPdf(url);
    const resolved = resolveUrl(url);

    return (
        <button
            className="dv-thumb"
            style={{ '--dv-accent': accent } as React.CSSProperties}
            onClick={onClick}
            title={`View ${label}`}
            type="button"
        >
            {/* Preview */}
            <div className="dv-thumb-preview">
                {img && <img src={resolved} alt={label} className="dv-thumb-img" />}
                {pdf && (
                    <div className="dv-thumb-pdf-icon">
                        <FileText size={30} color={accent} />
                        <span className="dv-thumb-pdf-text">PDF</span>
                    </div>
                )}
                {!img && !pdf && (
                    <div className="dv-thumb-pdf-icon">
                        <ImageIcon size={30} color={accent} />
                    </div>
                )}
                {/* Hover overlay */}
                <div className="dv-thumb-hover">
                    <ExternalLink size={20} color="white" />
                    <span>View</span>
                </div>
            </div>
            {/* Label */}
            <div className="dv-thumb-label" style={{ color: accent }}>
                {pdf ? <FileText size={10} /> : <ImageIcon size={10} />}
                <span>{label}</span>
            </div>
        </button>
    );
};

/* ─────────────── DocModal ─────────────── */
interface DocModalProps {
    url: string;
    label: string;
    onClose: () => void;
}

export const DocModal = ({ url, label, onClose }: DocModalProps) => {
    const resolved = resolveUrl(url);
    const pdf      = isPdf(url);
    const img      = isImage(url);
    const [scale, setScale]     = useState(1);
    const [rotate, setRotate]   = useState(0);

    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const zoomIn  = () => setScale(s => Math.min(s + 0.25, 3));
    const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
    const rotateCw = () => setRotate(r => (r + 90) % 360);

    return (
        <div className="dv-overlay" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label={label}>
            <div className="dv-modal">
                {/* ── Header bar ── */}
                <div className="dv-modal-header">
                    <div className="dv-modal-title">
                        {pdf ? <FileText size={16} /> : <ImageIcon size={16} />}
                        <span>{label}</span>
                    </div>
                    <div className="dv-modal-actions">
                        {img && (
                            <>
                                <button className="dv-icon-btn" onClick={zoomOut} title="Zoom out"><ZoomOut size={15} /></button>
                                <span className="dv-scale-badge">{Math.round(scale * 100)}%</span>
                                <button className="dv-icon-btn" onClick={zoomIn} title="Zoom in"><ZoomIn size={15} /></button>
                                <button className="dv-icon-btn" onClick={rotateCw} title="Rotate"><RotateCw size={15} /></button>
                            </>
                        )}
                        <a
                            href={resolved}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dv-open-btn"
                            title="Open original in new tab"
                        >
                            <ExternalLink size={13} />
                            Open
                        </a>
                        <button className="dv-close-btn" onClick={onClose} title="Close">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="dv-modal-body">
                    {pdf && (
                        <iframe
                            src={embedUrl(url)}
                            className="dv-pdf-frame"
                            title={label}
                            allow="fullscreen"
                        />
                    )}
                    {img && (
                        <div className="dv-img-scroll">
                            <img
                                src={resolved}
                                alt={label}
                                className="dv-full-img"
                                style={{
                                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                                    transformOrigin: 'center center',
                                }}
                            />
                        </div>
                    )}
                    {!pdf && !img && (
                        <div className="dv-fallback">
                            <FileText size={52} color="#8b5cf6" />
                            <p>Cannot preview this file type in browser.</p>
                            <a href={resolved} target="_blank" rel="noopener noreferrer" className="dv-open-btn">
                                <ExternalLink size={14} /> Open File
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                /* ── Overlay ── */
                .dv-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: rgba(2, 6, 23, 0.93);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    animation: dvFadeIn 0.2s ease;
                }
                @keyframes dvFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ── Modal box ── */
                .dv-modal {
                    width: 100%;
                    max-width: 920px;
                    height: min(88vh, 860px);
                    background: #0d1117;
                    border-radius: 18px;
                    border: 1px solid rgba(139,92,246,0.25);
                    box-shadow: 0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: dvSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
                }
                @keyframes dvSlideUp {
                    from { transform: translateY(30px) scale(0.97); opacity: 0; }
                    to   { transform: translateY(0) scale(1); opacity: 1; }
                }

                /* ── Header ── */
                .dv-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 18px;
                    background: rgba(255,255,255,0.025);
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    gap: 12px;
                    flex-shrink: 0;
                }
                .dv-modal-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: rgba(255,255,255,0.75);
                    font-size: 0.875rem;
                    font-weight: 600;
                    min-width: 0;
                }
                .dv-modal-title span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .dv-modal-actions {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                }
                .dv-icon-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: rgba(255,255,255,0.6);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dv-icon-btn:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.5); color: #fff; }
                .dv-scale-badge {
                    font-size: 0.72rem;
                    color: rgba(255,255,255,0.45);
                    min-width: 38px;
                    text-align: center;
                    font-weight: 600;
                }
                .dv-open-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 12px;
                    background: rgba(139,92,246,0.15);
                    border: 1px solid rgba(139,92,246,0.4);
                    border-radius: 8px;
                    color: #a78bfa;
                    font-size: 0.78rem;
                    font-weight: 600;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dv-open-btn:hover { background: rgba(139,92,246,0.3); color: #fff; }
                .dv-close-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: rgba(239,68,68,0.12);
                    border: 1px solid rgba(239,68,68,0.3);
                    border-radius: 8px;
                    color: #f87171;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dv-close-btn:hover { background: rgba(239,68,68,0.3); color: #fff; }

                /* ── Body ── */
                .dv-modal-body {
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    background: #fff;
                }
                .dv-pdf-frame {
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                }
                .dv-img-scroll {
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background: #111827;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                }
                .dv-full-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 4px;
                    transition: transform 0.3s ease;
                    display: block;
                }
                .dv-fallback {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    color: rgba(255,255,255,0.4);
                    background: #111827;
                    font-size: 0.9rem;
                    text-align: center;
                    padding: 40px;
                }

                /* ── Thumbnail button ── */
                .dv-thumb {
                    all: unset;
                    cursor: pointer;
                    display: block;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1.5px solid rgba(255,255,255,0.08);
                    background: rgba(0,0,0,0.45);
                    width: 88px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
                    transition: all 0.3s cubic-bezier(0.175,0.885,0.32,1.3);
                    flex-shrink: 0;
                }
                .dv-thumb:hover {
                    border-color: var(--dv-accent, #8b5cf6);
                    transform: translateY(-5px) scale(1.04);
                    box-shadow: 0 16px 36px rgba(0,0,0,0.45), 0 0 0 1px var(--dv-accent, #8b5cf6);
                }
                .dv-thumb-preview {
                    position: relative;
                    width: 88px;
                    height: 116px;
                    overflow: hidden;
                    background: #0d1117;
                }
                .dv-thumb-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .dv-thumb-pdf-icon {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: linear-gradient(160deg, rgba(139,92,246,0.07) 0%, rgba(0,0,0,0) 100%);
                }
                .dv-thumb-pdf-text {
                    font-size: 0.6rem;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    color: rgba(255,255,255,0.35);
                }
                .dv-thumb-hover {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.72);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    opacity: 0;
                    transition: opacity 0.2s;
                    backdrop-filter: blur(3px);
                }
                .dv-thumb-hover span {
                    color: rgba(255,255,255,0.9);
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                .dv-thumb:hover .dv-thumb-hover { opacity: 1; }
                .dv-thumb-label {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 5px 7px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.02);
                }
                .dv-thumb-label span {
                    font-size: 0.55rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                @media (max-width: 600px) {
                    .dv-modal { height: 95vh; border-radius: 14px; }
                    .dv-thumb { width: 72px; }
                    .dv-thumb-preview { width: 72px; height: 96px; }
                }
            `}</style>
        </div>
    );
};
