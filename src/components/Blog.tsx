import { usePortfolio } from '../context/PortfolioContext';

const Blog = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const posts = data.blog;

    return (
        <section id="blog" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">Journal</span>
                    <h2>Latest <span className="gradient-text">Insights</span></h2>
                </div>
                <div className="blog-grid">
                    {posts.map((post, index) => (
                        <div key={index} className="blog-card fade-in" ref={addToRefs}>
                            <div className="blog-img"></div>
                            <div className="blog-content">
                                <span className="category">{post.category}</span>
                                <h3>{post.title}</h3>
                                <p className="date">{post.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .blog-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
                .blog-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; overflow: hidden; transition: var(--transition); }
                .blog-card:hover { transform: translateY(-8px); border-color: var(--primary); }
                .blog-img { height: 200px; background: var(--border-color); }
                .blog-content { padding: 24px; }
                .blog-content .category { color: var(--primary); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; display: block; }
                .blog-content h3 { font-size: 1.25rem; margin-bottom: 8px; }
                .blog-content .date { font-size: 0.875rem; color: var(--text-secondary); }
                @media (max-width: 768px) { .blog-grid { grid-template-columns: 1fr; } }
            `}</style>
        </section>
    );
};

export default Blog;
