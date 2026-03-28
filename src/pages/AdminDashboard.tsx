import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { data, updateData } = usePortfolio();
    const [editData, setEditData] = useState(data);
    const [saveStatus, setSaveStatus] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (localStorage.getItem('admin_auth') !== 'true') {
            navigate('/login/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        navigate('/login/admin');
    };

    const handleSave = (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        updateData(editData);
        setSaveStatus('Modifications saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
    };

    // Array manipulation helpers
    const handleArrayChange = (category: string, index: number, field: string, value: any) => {
        setEditData(prev => {
            const newArray = [...(prev as any)[category]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [category]: newArray };
        });
    };

    const handleAddItem = (category: string, defaultItem: any) => {
        setEditData(prev => ({
            ...prev,
            [category]: [...(prev as any)[category], defaultItem]
        }));
    };

    const handleRemoveItem = (category: string, index: number) => {
        setEditData(prev => ({
            ...prev,
            [category]: (prev as any)[category].filter((_: any, i: number) => i !== index)
        }));
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin <span className="gradient-text">Panel</span></h2>
                    <div className="sec-badge"><span className="dot"></span> Live</div>
                </div>

                <div className="sidebar-group-title">CONTENT MANAGEMENT</div>
                <nav className="sidebar-nav primary-nav">
                    {[
                        { id: 'profile', icon: '🏠', label: 'Intro & Profile' },
                        { id: 'education', icon: '🎓', label: 'Education' },
                        { id: 'work', icon: '💼', label: 'Work History' },
                        { id: 'experience', icon: '🏆', label: 'Achievements' },
                        { id: 'skills', icon: '💻', label: 'Tech Stack' },
                        { id: 'projects', icon: '🚀', label: 'Portfolio' },
                        { id: 'blog', icon: '📝', label: 'Journal' }
                    ].map(tab => (
                        <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                            <span className="icon">{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-group-title">SYSTEM ADMINISTRATION</div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <span className="icon">📊</span> Overview
                    </button>
                    <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <span className="icon">👥</span> Users
                    </button>
                    <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <span className="icon">⚙️</span> Settings
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={() => navigate('/')} className="footer-btn"><span className="icon">🌐</span> View Site</button>
                    <button onClick={handleLogout} className="footer-btn danger"><span className="icon">🔓</span> Logout</button>
                </div>
            </aside>

            <main className="admin-main">
                <div className="main-content-wrapper fade-in" key={activeTab}>

                    {/* OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="tab-pane">
                            <h2 className="pane-title">System Overview</h2>
                            <div className="dashboard-grid">
                                <div className="dashboard-card"><div className="card-icon">👁️</div><div className="card-info"><h3>Total Views</h3><p className="stat">4,289</p></div></div>
                                <div className="dashboard-card"><div className="card-icon">✉️</div><div className="card-info"><h3>Messages</h3><p className="stat">12</p></div></div>
                                <div className="dashboard-card"><div className="card-icon">⚙️</div><div className="card-info"><h3>Health</h3><p className="stat" style={{color: '#10b981'}}>Active</p></div></div>
                            </div>
                        </div>
                    )}

                    {/* INTRO & PROFILE (Hero + About) */}
                    {activeTab === 'profile' && (
                        <div className="tab-pane cms-pane">
                            <div className="pane-header">
                                <div><h2 className="pane-title">Intro & Profile</h2><p className="pane-desc">Manage your core identity, tagline, and biography.</p></div>
                                <button onClick={() => handleSave()} className="btn btn-primary top-save-btn">Save Changes</button>
                            </div>
                            {saveStatus && <div className="status-badge active mb-4">✓ {saveStatus}</div>}
                            
                            <div className="cms-form form-section">
                                <h4>Hero Banner</h4>
                                <div className="flex-group">
                                    <div className="w-50 form-group"><label>Display Name</label><input type="text" value={editData.hero.name} onChange={(e) => setEditData({...editData, hero: {...editData.hero, name: e.target.value}})} /></div>
                                    <div className="w-50 form-group"><label>Primary Tagline</label><input type="text" value={editData.hero.title} onChange={(e) => setEditData({...editData, hero: {...editData.hero, title: e.target.value}})} /></div>
                                </div>
                            </div>

                            <div className="cms-form form-section">
                                <h4>About Me Biography</h4>
                                <div className="form-group"><label>Bio Paragraphs (Use double line breaks to separate)</label><textarea rows={6} value={editData.about.bio} onChange={(e) => setEditData({...editData, about: {...editData.about, bio: e.target.value}})} /></div>
                                <div className="flex-group">
                                    <div className="w-50 form-group"><label>Age Stat</label><input type="text" value={editData.about.age} onChange={(e) => setEditData({...editData, about: {...editData.about, age: e.target.value}})} /></div>
                                    <div className="w-50 form-group"><label>Projects Stat</label><input type="text" value={editData.about.projects} onChange={(e) => setEditData({...editData, about: {...editData.about, projects: e.target.value}})} /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EDUCATION */}
                    {activeTab === 'education' && (
                        <div className="tab-pane cms-pane">
                            <div className="pane-header">
                                <div><h2 className="pane-title">Academic Journey</h2><p className="pane-desc">Manage your educational timeline.</p></div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => handleAddItem('education', { degree: '', school: '', year: '', major: '' })} className="btn btn-secondary top-save-btn">Add Degree</button>
                                    <button onClick={() => handleSave()} className="btn btn-primary top-save-btn">Save Changes</button>
                                </div>
                            </div>
                            {saveStatus && <div className="status-badge active mb-4">✓ {saveStatus}</div>}

                            <div className="array-list">
                                {editData.education.map((item, idx) => (
                                    <div key={idx} className="cms-form form-section array-item">
                                        <div className="item-badge">Degree {idx + 1}</div>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('education', idx)}>Delete</button>
                                        <div className="flex-group">
                                            <div className="w-50 form-group"><label>Degree Title</label><input type="text" value={item.degree} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} /></div>
                                            <div className="w-50 form-group"><label>Institution</label><input type="text" value={item.school} onChange={(e) => handleArrayChange('education', idx, 'school', e.target.value)} /></div>
                                        </div>
                                        <div className="flex-group">
                                            <div className="w-50 form-group"><label>Timeline (e.g. 2021-2026)</label><input type="text" value={item.year} onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)} /></div>
                                            <div className="w-50 form-group"><label>Major / Details</label><input type="text" value={item.major} onChange={(e) => handleArrayChange('education', idx, 'major', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* WORK HISTORY */}
                    {activeTab === 'work' && (
                        <div className="tab-pane cms-pane">
                            <div className="pane-header">
                                <div><h2 className="pane-title">Work Experience</h2><p className="pane-desc">Manage your professional career history.</p></div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => handleAddItem('work', { role: '', company: '', startDate: '', endDate: '', details: [] })} className="btn btn-secondary top-save-btn">Add Job</button>
                                    <button onClick={() => handleSave()} className="btn btn-primary top-save-btn">Save Changes</button>
                                </div>
                            </div>
                            {saveStatus && <div className="status-badge active mb-4">✓ {saveStatus}</div>}

                            <div className="array-list">
                                {editData.work.map((item, idx) => (
                                    <div key={idx} className="cms-form form-section array-item">
                                        <div className="item-badge">Job {idx + 1}</div>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('work', idx)}>Delete</button>
                                        <div className="flex-group">
                                            <div className="w-50 form-group"><label>Role / Position</label><input type="text" value={item.role} onChange={(e) => handleArrayChange('work', idx, 'role', e.target.value)} /></div>
                                            <div className="w-50 form-group"><label>Company Name</label><input type="text" value={item.company} onChange={(e) => handleArrayChange('work', idx, 'company', e.target.value)} /></div>
                                        </div>
                                        <div className="flex-group">
                                            <div className="w-50 form-group"><label>Start Date</label><input type="date" value={item.startDate} onChange={(e) => handleArrayChange('work', idx, 'startDate', e.target.value)} /></div>
                                            <div className="w-50 form-group">
                                                <label>End Date (Clear for 'Present')</label>
                                                <input type="date" value={item.endDate || ''} onChange={(e) => handleArrayChange('work', idx, 'endDate', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-group"><label>Responsibilities (One per line)</label><textarea rows={4} value={item.details.join('\n')} onChange={(e) => {
                                            const detailsArray = e.target.value.split('\n').filter(s => s.trim() !== "");
                                            handleArrayChange('work', idx, 'details', detailsArray);
                                        }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EXPERIENCE / ACHIEVEMENTS */}
                    {activeTab === 'experience' && (
                        <div className="tab-pane cms-pane">
                            <div className="pane-header">
                                <div><h2 className="pane-title">Achievements</h2><p className="pane-desc">Manage your hackathons and competition history.</p></div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => handleAddItem('experience', { role: '', company: '', period: '', desc: '' })} className="btn btn-secondary top-save-btn">Add Event</button>
                                    <button onClick={() => handleSave()} className="btn btn-primary top-save-btn">Save Changes</button>
                                </div>
                            </div>
                            {saveStatus && <div className="status-badge active mb-4">✓ {saveStatus}</div>}

                            <div className="array-list">
                                {editData.experience.map((item, idx) => (
                                    <div key={idx} className="cms-form form-section array-item">
                                        <div className="item-badge">Event {idx + 1}</div>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('experience', idx)}>Delete</button>
                                        <div className="flex-group">
                                            <div className="w-50 form-group"><label>Role / Award Name</label><input type="text" value={item.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} /></div>
                                            <div className="w-50 form-group"><label>Organization / Event</label><input type="text" value={item.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} /></div>
                                        </div>
                                        <div className="flex-group">
                                            <div className="w-50 form-group"><label>Year</label><input type="text" value={item.period} onChange={(e) => handleArrayChange('experience', idx, 'period', e.target.value)} /></div>
                                            <div className="w-50 form-group"><label>Short Description</label><input type="text" value={item.desc} onChange={(e) => handleArrayChange('experience', idx, 'desc', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SKILLS */}
                    {activeTab === 'skills' && (
                        <div className="tab-pane cms-pane">
                            <div className="pane-header">
                                <div><h2 className="pane-title">Technical Stack</h2><p className="pane-desc">Manage your categorized skills marquee.</p></div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => handleAddItem('skills', { name: '', items: [] })} className="btn btn-secondary top-save-btn">Add Category</button>
                                    <button onClick={() => handleSave()} className="btn btn-primary top-save-btn">Save Changes</button>
                                </div>
                            </div>
                            {saveStatus && <div className="status-badge active mb-4">✓ {saveStatus}</div>}

                            <div className="array-list">
                                {editData.skills.map((cat, idx) => (
                                    <div key={idx} className="cms-form form-section array-item">
                                        <div className="item-badge">{cat.name || 'New Category'}</div>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('skills', idx)}>Delete</button>
                                        <div className="form-group"><label>Category Name</label><input type="text" value={cat.name} onChange={(e) => handleArrayChange('skills', idx, 'name', e.target.value)} /></div>
                                        <div className="form-group"><label>Skills (Comma separated, e.g. Python, Java, React)</label><textarea rows={3} value={cat.items.join(', ')} onChange={(e) => {
                                            const itemsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== "");
                                            handleArrayChange('skills', idx, 'items', itemsArray);
                                        }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROJECTS */}
                    {activeTab === 'projects' && (
                        <div className="tab-pane cms-pane">
                            <div className="pane-header">
                                <div><h2 className="pane-title">Portfolio Projects</h2><p className="pane-desc">Manage the 3D rotating showcase projects.</p></div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => {
                                        const nextShowcase = editData.projects.length > 0 
                                            ? Math.max(...editData.projects.map(p => p.showcase)) + 1 
                                            : 1;
                                        handleAddItem('projects', { title: '', desc: '', tags: [], showcase: nextShowcase });
                                    }} className="btn btn-secondary top-save-btn">Add Project</button>
                                    <button onClick={() => handleSave()} className="btn btn-primary top-save-btn">Save All Projects</button>
                                </div>
                            </div>
                            {saveStatus && <div className="status-badge active mb-4">✓ {saveStatus}</div>}

                            <div className="array-list">
                                {editData.projects.map((proj, idx) => (
                                    <div key={idx} className="cms-form form-section array-item">
                                        <div className="item-badge">Showcase {proj.showcase}</div>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('projects', idx)}>Delete</button>
                                        <div className="form-group"><label>Project Title</label><input type="text" value={proj.title} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} /></div>
                                        <div className="form-group"><label>Description</label><textarea rows={3} value={proj.desc} onChange={(e) => handleArrayChange('projects', idx, 'desc', e.target.value)} /></div>
                                        <div className="form-group"><label>Tech Tags (Comma separated)</label><input type="text" value={proj.tags.join(', ')} onChange={(e) => {
                                            const tagsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== "");
                                            handleArrayChange('projects', idx, 'tags', tagsArray);
                                        }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BLOG / JOURNAL */}
                    {activeTab === 'blog' && (
                        <div className="tab-pane cms-pane">
                            <div className="pane-header">
                                <div><h2 className="pane-title">Journal Insights</h2><p className="pane-desc">Manage your recent posts metadata.</p></div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => handleAddItem('blog', { title: '', date: '', category: '' })} className="btn btn-secondary top-save-btn">Add Article</button>
                                    <button onClick={() => handleSave()} className="btn btn-primary top-save-btn">Save Changes</button>
                                </div>
                            </div>
                            {saveStatus && <div className="status-badge active mb-4">✓ {saveStatus}</div>}

                            <div className="array-list">
                                {editData.blog.map((post, idx) => (
                                    <div key={idx} className="cms-form form-section array-item">
                                        <div className="item-badge">Post {idx + 1}</div>
                                        <button className="remove-btn" onClick={() => handleRemoveItem('blog', idx)}>Delete</button>
                                        <div className="form-group"><label>Article Title</label><input type="text" value={post.title} onChange={(e) => handleArrayChange('blog', idx, 'title', e.target.value)} /></div>
                                        <div className="flex-group">
                                            <div className="w-50 form-group"><label>Category Tag</label><input type="text" value={post.category} onChange={(e) => handleArrayChange('blog', idx, 'category', e.target.value)} /></div>
                                            <div className="w-50 form-group"><label>Published Date</label><input type="text" value={post.date} onChange={(e) => handleArrayChange('blog', idx, 'date', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* USERS */}
                    {activeTab === 'users' && (
                        <div className="tab-pane">
                            <h2 className="pane-title">User Activity</h2>
                            <div className="dashboard-card full-width"><div style={{ overflowX: 'auto' }}><table className="admin-table"><thead><tr><th>User Name</th><th>Email</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr><td>John Doe</td><td>john@example.com</td><td>Today, 10:45 AM</td><td><span className="status-badge active">Active</span></td><td><button className="btn-small btn-secondary">Manage</button></td></tr></tbody></table></div></div>
                        </div>
                    )}

                    {/* SETTINGS */}
                    {activeTab === 'settings' && (
                        <div className="tab-pane">
                            <h2 className="pane-title">Settings</h2>
                            <div className="dashboard-card full-width" style={{ textAlign: 'center', padding: '80px 20px' }}>
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>⚙️</span><h3 style={{ color: '#e2e8f0', marginBottom: '8px' }}>Preferences Locked</h3><p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>System configuration is currently read-only.</p>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <style>{`
                .admin-layout { display: flex; min-height: 100vh; background: #030712; }
                .admin-sidebar { width: 260px; background: #0b1120; border-right: 1px solid #1e293b; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
                .sidebar-header { padding: 32px 24px; border-bottom: 1px solid #1e293b; }
                .sidebar-header h2 { font-size: 1.5rem; font-weight: 800; color: #f8fafc; margin-bottom: 8px; }
                .sec-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 4px 8px; border-radius: 100px; border: 1px solid rgba(16, 185, 129, 0.2); text-transform: uppercase; letter-spacing: 0.05em; }
                .sec-badge .dot { width: 5px; height: 5px; background: #10b981; border-radius: 50%; box-shadow: 0 0 6px #10b981; }
                
                .sidebar-group-title { padding: 24px 20px 8px; font-size: 0.7rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
                .sidebar-nav { padding: 0 12px; display: flex; flex-direction: column; gap: 4px; }
                .primary-nav { flex: 1; }
                .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; border-radius: 8px; color: #94a3b8; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; text-align: left; }
                .nav-item:hover { background: rgba(255, 255, 255, 0.03); color: #e2e8f0; }
                .nav-item.active { background: #1e293b; color: #f8fafc; border-left: 3px solid #3b82f6; border-radius: 0 8px 8px 0; }
                .nav-item .icon { width: 20px; text-align: center; }
                
                .sidebar-footer { padding: 20px 12px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 4px; margin-top: auto; }
                .footer-btn { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; border-radius: 8px; color: #94a3b8; font-size: 0.875rem; font-weight: 600; cursor: pointer; text-align: left; }
                .footer-btn:hover { background: rgba(255, 255, 255, 0.03); color: #f8fafc; }
                .footer-btn.danger:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                .admin-main { flex: 1; padding: 48px; overflow-y: auto; height: 100vh; box-sizing: border-box; background: #030712; }
                .main-content-wrapper { max-width: 900px; margin: 0 auto; }
                
                .pane-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #1e293b; }
                .pane-title { font-size: 2rem; font-weight: 800; color: #f8fafc; margin-bottom: 8px; }
                .pane-desc { color: #94a3b8; font-size: 0.9375rem; }
                .mb-4 { margin-bottom: 24px; }

                /* Dashboard Grid */
                .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
                .dashboard-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; }
                .dashboard-card.full-width { display: block; grid-column: 1 / -1; }
                .card-icon { font-size: 2rem; width: 56px; height: 56px; border-radius: 14px; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; }
                .card-info h3 { font-size: 1rem; color: #94a3b8; margin-bottom: 4px; font-weight: 500; }
                .card-info .stat { font-size: 2rem; font-weight: 800; color: #f8fafc; margin: 0; }
                
                /* CMS Forms */
                .cms-form.form-section { padding: 32px; background: #0b1120; border-radius: 16px; border: 1px solid #1e293b; margin-bottom: 24px; position: relative; }
                .cms-form h4 { font-size: 1.125rem; font-weight: 700; color: #3b82f6; margin-bottom: 24px; }
                .flex-group { display: flex; gap: 20px; }
                .w-50 { flex: 1; }
                .form-group { margin-bottom: 20px; }
                .cms-form label { display: block; font-size: 0.8125rem; font-weight: 600; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
                .cms-form input, .cms-form textarea { width: 100%; padding: 14px 18px; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: #f8fafc; font-family: inherit; font-size: 0.95rem; resize: vertical; box-sizing: border-box; }
                .cms-form input:focus, .cms-form textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
                
                /* Array Editors */
                .array-item { border-left: 4px solid #3b82f6 !important; }
                .item-badge { position: absolute; top: -12px; left: 24px; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; z-index: 2; }
                .remove-btn { position: absolute; top: 12px; right: 12px; padding: 6px 12px; background: transparent; border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; opacity: 0.6; }
                .remove-btn:hover { opacity: 1; background: rgba(239, 68, 68, 0.1); }
                .light-mode .remove-btn { border-color: #ef4444; color: #ef4444; }

                /* Shared UI */
                .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                .admin-table th, .admin-table td { padding: 16px; text-align: left; border-bottom: 1px solid #1e293b; color: #e2e8f0; }
                .admin-table th { color: #64748b; font-weight: 600; font-size: 0.8125rem; text-transform: uppercase; border-bottom: 2px solid #1e293b; }
                .status-badge { padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; }
                .status-badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
                .top-save-btn { padding: 12px 24px; font-size: 0.9375rem; border-radius: 10px; }

                .fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

                @media (max-width: 992px) {
                    .admin-layout { flex-direction: column; }
                    .admin-sidebar { width: 100%; height: auto; position: relative; }
                    .sidebar-nav { flex-direction: row; flex-wrap: wrap; }
                    .nav-item { flex: auto; justify-content: center; }
                    .admin-main { padding: 24px; height: auto; }
                    .flex-group { flex-direction: column; gap: 0; }
                    .pane-header { flex-direction: column; align-items: flex-start; gap: 16px; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
