const Contact = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    return (
        <section id="contact" className="section">
            <div className="container">
                <div className="contact-box fade-in" ref={addToRefs}>
                    <h2>Ready to start your <span className="gradient-text">next project?</span></h2>
                    <p>Get in touch for collaborations or inquiries. I'm currently based in Dhaka, Bangladesh.</p>
                    <div className="contact-info">
                        <p>📍 Mohammadpur, Dhaka-1207</p>
                        <p>📧 shahabdulmazid.ezan@yahoo.com</p>
                        <p>📞 +880 1531-329222</p>
                    </div>
                    <a href="mailto:shahabdulmazid.ezan@yahoo.com" className="btn btn-primary">Send me an Email</a>
                </div>
            </div>
            <style>{`
                .contact-box { background: var(--card-bg); border: 1px solid var(--border-color); padding: 80px 40px; border-radius: 40px; text-align: center; }
                .contact-box h2 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 24px; }
                .contact-box p { color: var(--text-secondary); margin-bottom: 32px; max-width: 600px; margin-inline: auto; }
                .contact-info { margin-bottom: 40px; display: flex; flex-direction: column; gap: 8px; }
            `}</style>
        </section>
    );
};

export default Contact;
