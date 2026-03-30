import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Eye, Calendar, Phone, Trash2, Reply, Plus, Minus } from 'lucide-react';
import type { EducationItem, ExperienceItem, WorkItem, ProjectItem, PaperItem, SkillCategory } from '../context/PortfolioContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { data, updateData } = usePortfolio();
    const [editData, setEditData] = useState(data);
    const [saveStatus, setSaveStatus] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    
    const [stats, setStats] = useState({ views: 0, messages: 0, admins: 0 });
    const [messages, setMessages] = useState<any[]>([]);
    const [adminsList, setAdminsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [bibtexInputs, setBibtexInputs] = useState<{[key:number]:string}>({});

    const handleParseBibtex = (index: number) => {
        const str = bibtexInputs[index] || '';
        const extract = (key: string) => {
            const re = new RegExp(`${key}\\s*=\\s*\\{([^\\}]+)\\}`, 'i');
            const match = str.match(re);
            return match ? match[1].replace(/[\r\n]+/g, ' ').trim() : '';
        };
        setEditData(prev => {
            const papers = [...prev.papers];
            const title = extract('title');
            if (title) papers[index].title = title;
            const authors = extract('author');
            if (authors) papers[index].authors = authors;
            const venue = extract('booktitle') || extract('journal');
            if (venue) papers[index].venue = venue;
            const year = extract('year');
            if (year) papers[index].year = year;
            const keywords = extract('keywords');
            if (keywords) papers[index].keywords = keywords;
            const doi = extract('doi');
            if (doi) papers[index].doi = doi;
            return { ...prev, papers };
        });
        setSaveStatus('BibTeX Extracted!');
        setTimeout(()=>setSaveStatus(''), 2000);
    };

    useEffect(() => {
        if (localStorage.getItem('admin_auth') !== 'true') {
            navigate('/login/admin');
        } else {
            fetchRealTimeData();
        }
    }, [navigate]);

    // Sync editData when data changes (e.g. on mount)
    useEffect(() => {
        setEditData(data);
    }, [data]);

    const fetchRealTimeData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

            const viewsRes = await fetch('/api/analytics');
            const viewsData = await viewsRes.json();
            
            const msgsRes = await fetch('/api/messages');
            const msgsData = await msgsRes.json();

            let adminsData = [];
            if (token) {
                const adminsRes = await fetch('/api/admin/list', { headers });
                const json = await adminsRes.json();
                if (json.success) adminsData = json.data;
            }

            setStats({ 
                views: viewsData?.count || 0, 
                messages: msgsData?.length || 0,
                admins: adminsData.length
            });
            setMessages(msgsData || []);
            setAdminsList(adminsData);
        } catch (e){
            console.error(e)
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            fetchRealTimeData();
        } catch { alert('Failed to delete message'); }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('admin_token');
        navigate('/login/admin');
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        if (!token) return alert('Session expired.');

        try {
            const res = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword })
            });
            const data = await res.json();
            if (data.success) {
                alert('Admin user created successfully!');
                setNewAdminEmail('');
                setNewAdminPassword('');
                fetchRealTimeData();
            } else {
                alert(data.message || 'Error creating admin');
            }
        } catch (e) {
            alert('Server error creating admin');
        }
    };

    const handleSave = () => {
        updateData(editData);
        setSaveStatus('Changes saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
    };

    // ── Generic list helpers ──────────────────────────────────────────────────
    const updateListItem = (key: string, index: number, field: string, value: any) => {
        setEditData(prev => {
            const list = [...(prev as any)[key]];
            list[index] = { ...list[index], [field]: value };
            return { ...prev, [key]: list };
        });
    };

    const removeListItem = (key: string, index: number) => {
        setEditData(prev => {
            const list = [...(prev as any)[key]];
            list.splice(index, 1);
            return { ...prev, [key]: list };
        });
    };

    const addListItem = (key: string, template: any) => {
        setEditData(prev => ({ ...prev, [key]: [...(prev as any)[key], template] }));
    };

    // ── Work detail helpers ───────────────────────────────────────────────────
    const updateWorkDetail = (workIndex: number, detailIndex: number, value: string) => {
        setEditData(prev => {
            const work = [...prev.work];
            const details = [...work[workIndex].details];
            details[detailIndex] = value;
            work[workIndex] = { ...work[workIndex], details };
            return { ...prev, work };
        });
    };
    const addWorkDetail = (workIndex: number) => {
        setEditData(prev => {
            const work = [...prev.work];
            work[workIndex] = { ...work[workIndex], details: [...work[workIndex].details, ''] };
            return { ...prev, work };
        });
    };
    const removeWorkDetail = (workIndex: number, detailIndex: number) => {
        setEditData(prev => {
            const work = [...prev.work];
            const details = work[workIndex].details.filter((_, i) => i !== detailIndex);
            work[workIndex] = { ...work[workIndex], details };
            return { ...prev, work };
        });
    };

    // ── Skill helpers ─────────────────────────────────────────────────────────
    const updateSkillItem = (catIndex: number, itemIndex: number, value: string) => {
        setEditData(prev => {
            const skills = prev.skills.map((cat, ci) => {
                if (ci !== catIndex) return cat;
                const items = cat.items.map((it, ii) => ii === itemIndex ? value : it);
                return { ...cat, items };
            });
            return { ...prev, skills };
        });
    };
    const addSkillItem = (catIndex: number) => {
        setEditData(prev => {
            const skills = prev.skills.map((cat, ci) =>
                ci === catIndex ? { ...cat, items: [...cat.items, ''] } : cat
            );
            return { ...prev, skills };
        });
    };
    const removeSkillItem = (catIndex: number, itemIndex: number) => {
        setEditData(prev => {
            const skills = prev.skills.map((cat, ci) =>
                ci === catIndex ? { ...cat, items: cat.items.filter((_, ii) => ii !== itemIndex) } : cat
            );
            return { ...prev, skills };
        });
    };

    // ── Project tag helpers ───────────────────────────────────────────────────
    const updateProjectTag = (projIndex: number, tagIndex: number, value: string) => {
        setEditData(prev => {
            const projects = prev.projects.map((p, pi) => {
                if (pi !== projIndex) return p;
                const tags = p.tags.map((t, ti) => ti === tagIndex ? value : t);
                return { ...p, tags };
            });
            return { ...prev, projects };
        });
    };

    const navItems = [
        { id: 'profile', icon: '🏠', label: 'Intro & Profile' },
        { id: 'projects', icon: '🚀', label: 'Portfolio' },
        { id: 'skills', icon: '💻', label: 'Tech Stack' },
        { id: 'education', icon: '🎓', label: 'Education' },
        { id: 'work', icon: '💼', label: 'Work History' },
        { id: 'experience', icon: '🏆', label: 'Achievements' },
        { id: 'papers', icon: '📄', label: 'Research Papers' },
        { id: 'contact', icon: '📞', label: 'Contact Details' },
    ];

    const SaveBar = () => (
        <div className="pane-header">
            <div>
                <h2 className="pane-title" style={{ textTransform: 'capitalize' }}>
                    {navItems.find(n => n.id === activeTab)?.label || activeTab}
                </h2>
                <p className="pane-desc">Edit and save your content changes.</p>
            </div>
            <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
        </div>
    );

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <div className="admin-mobile-header">
                <h2>Admin <span className="gradient-text">Panel</span></h2>
                <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header desktop-only">
                    <h2>Admin <span className="gradient-text">Panel</span></h2>
                    <div className="sec-badge"><span className="dot"></span> Live</div>
                </div>

                <div className="sidebar-group-title">CONTENT MANAGEMENT</div>
                <nav className="sidebar-nav primary-nav">
                    {navItems.map(tab => (
                        <button key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}>
                            <span className="icon">{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-group-title">SYSTEM ADMINISTRATION</div>
                <nav className="sidebar-nav">
                    {[
                        { id: 'overview', icon: '📊', label: 'Overview' },
                        { id: 'messages', icon: '✉️', label: 'Messages', badge: stats.messages },
                        { id: 'admins', icon: '👥', label: 'Admin Users', badge: stats.admins },
                        { id: 'settings', icon: '⚙️', label: 'Settings' },
                    ].map(tab => (
                        <button key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}>
                            <span className="icon">{tab.icon}</span> {tab.label}
                            {tab.badge ? <span className="count-badge">{tab.badge}</span> : null}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="pwa-badge"><span className="icon">📲</span> App Ready</div>
                    <button onClick={() => navigate('/')} className="footer-btn"><span className="icon">🌐</span> View Site</button>
                    <button onClick={handleLogout} className="footer-btn danger"><span className="icon">🔓</span> Logout</button>
                </div>
            </aside>

            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

            <main className="admin-main">
                <div className="main-content-wrapper fade-in" key={activeTab}>

                    {/* ── OVERVIEW ─────────────────────────────────────────── */}
                    {activeTab === 'overview' && (
                        <div className="tab-pane">
                            <h2 className="pane-title">System Overview</h2>
                            <div className="dashboard-grid">
                                <div className="dashboard-card">
                                    <div className="card-icon"><Eye size={24} /></div>
                                    <div className="card-info">
                                        <h3>Total Views</h3>
                                        <p className="stat">{loading ? '...' : stats.views.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="dashboard-card" onClick={() => setActiveTab('messages')} style={{ cursor: 'pointer' }}>
                                    <div className="card-icon"><Mail size={24} /></div>
                                    <div className="card-info">
                                        <h3>New Messages</h3>
                                        <p className="stat">{loading ? '...' : stats.messages}</p>
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-icon"><Eye size={24} style={{ color: '#10b981' }} /></div>
                                    <div className="card-info">
                                        <h3>Health</h3>
                                        <p className="stat" style={{ color: '#10b981' }}>Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── MESSAGES ─────────────────────────────────────────── */}
                    {activeTab === 'messages' && (
                        <div className="tab-pane">
                            <div className="pane-header">
                                <div>
                                    <h2 className="pane-title">Inbox</h2>
                                    <p className="pane-desc">Manage communications from your portfolio visitors.</p>
                                </div>
                                <button onClick={fetchRealTimeData} className="btn btn-secondary">Refresh</button>
                            </div>
                            <div className="messages-list">
                                {messages.length === 0 ? (
                                    <div className="empty-state"><Mail size={48} /><p>No messages yet.</p></div>
                                ) : messages.map((msg) => (
                                    <div key={msg.id} className="message-card">
                                        <div className="message-header">
                                            <div className="user-info">
                                                <div className="avatar">{msg.name.charAt(0)}</div>
                                                <div>
                                                    <h4>{msg.name}</h4>
                                                    <p className="meta"><Mail size={12} /> {msg.email} {msg.phone && <><Phone size={12} /> {msg.phone}</>}</p>
                                                </div>
                                            </div>
                                            <div className="message-date"><Calendar size={14} /> {new Date(msg.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div className="message-body"><p>{msg.query}</p></div>
                                        <div className="message-actions">
                                            <a href={`mailto:${msg.email}?subject=RE: Portfolio Inquiry`} className="btn-small btn-primary"><Reply size={14} /> Reply</a>
                                            <button onClick={() => handleDeleteMessage(msg.id)} className="btn-small btn-danger"><Trash2 size={14} /> Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── INTRO & PROFILE ──────────────────────────────────── */}
                    {activeTab === 'profile' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}

                            <div className="form-section">
                                <h4 className="section-label">Hero Banner</h4>
                                <div className="flex-group">
                                    <div className="form-group w-50">
                                        <label>Display Name</label>
                                        <input type="text" value={editData.hero.name}
                                            onChange={e => setEditData({ ...editData, hero: { ...editData.hero, name: e.target.value } })} />
                                    </div>
                                    <div className="form-group w-50">
                                        <label>Primary Tagline</label>
                                        <input type="text" value={editData.hero.title}
                                            onChange={e => setEditData({ ...editData, hero: { ...editData.hero, title: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <input type="text" value={editData.hero.description}
                                        onChange={e => setEditData({ ...editData, hero: { ...editData.hero, description: e.target.value } })} />
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="section-label">About Me Biography</h4>
                                <div className="form-group">
                                    <label>Bio (double line breaks = paragraphs)</label>
                                    <textarea rows={7} value={editData.about.bio}
                                        onChange={e => setEditData({ ...editData, about: { ...editData.about, bio: e.target.value } })} />
                                </div>
                                <div className="flex-group">
                                    <div className="form-group w-50">
                                        <label>Age / DOB Stat</label>
                                        <input type="text" value={editData.about.age}
                                            onChange={e => setEditData({ ...editData, about: { ...editData.about, age: e.target.value } })} />
                                    </div>
                                    <div className="form-group w-50">
                                        <label>Projects Stat</label>
                                        <input type="text" value={editData.about.projects}
                                            onChange={e => setEditData({ ...editData, about: { ...editData.about, projects: e.target.value } })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── EDUCATION ────────────────────────────────────────── */}
                    {activeTab === 'education' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}
                            {editData.education.map((item: EducationItem, i: number) => (
                                <div key={i} className="form-section item-card">
                                    <div className="item-card-header">
                                        <h4 className="section-label">Education #{i + 1}</h4>
                                        <button className="remove-btn" onClick={() => removeListItem('education', i)}><Minus size={14} /> Remove</button>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Degree / Certificate</label>
                                            <input type="text" value={item.degree} onChange={e => updateListItem('education', i, 'degree', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>School / Institution</label>
                                            <input type="text" value={item.school} onChange={e => updateListItem('education', i, 'school', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Year / Period</label>
                                            <input type="text" value={item.year} onChange={e => updateListItem('education', i, 'year', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>Major / Subject</label>
                                            <input type="text" value={item.major} onChange={e => updateListItem('education', i, 'major', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addListItem('education', { degree: '', school: '', year: '', major: '' })}>
                                <Plus size={16} /> Add Education
                            </button>
                        </div>
                    )}

                    {/* ── WORK HISTORY ─────────────────────────────────────── */}
                    {activeTab === 'work' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}
                            {editData.work.map((job: WorkItem, i: number) => (
                                <div key={i} className="form-section item-card">
                                    <div className="item-card-header">
                                        <h4 className="section-label">Position #{i + 1}</h4>
                                        <button className="remove-btn" onClick={() => removeListItem('work', i)}><Minus size={14} /> Remove</button>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Job Title / Role</label>
                                            <input type="text" value={job.role} onChange={e => updateListItem('work', i, 'role', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>Company Name</label>
                                            <input type="text" value={job.company} onChange={e => updateListItem('work', i, 'company', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Start Date (YYYY-MM-DD)</label>
                                            <input type="text" value={job.startDate} placeholder="e.g. 2022-01-15"
                                                onChange={e => updateListItem('work', i, 'startDate', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>End Date (leave blank = Ongoing)</label>
                                            <input type="text" value={job.endDate ?? ''} placeholder="e.g. 2024-06-30 or blank"
                                                onChange={e => updateListItem('work', i, 'endDate', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Responsibilities / Details</label>
                                        {job.details.map((detail, di) => (
                                            <div key={di} className="detail-row">
                                                <input type="text" value={detail}
                                                    onChange={e => updateWorkDetail(i, di, e.target.value)}
                                                    placeholder={`Detail ${di + 1}`} />
                                                <button className="icon-btn danger" onClick={() => removeWorkDetail(i, di)}><Minus size={14} /></button>
                                            </div>
                                        ))}
                                        <button className="add-inline-btn" onClick={() => addWorkDetail(i)}><Plus size={14} /> Add Detail</button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addListItem('work', { role: '', company: '', startDate: '', endDate: '', details: [''] })}>
                                <Plus size={16} /> Add Position
                            </button>
                        </div>
                    )}

                    {/* ── ACHIEVEMENTS (Experience) ─────────────────────────── */}
                    {activeTab === 'experience' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}
                            {editData.experience.map((item: ExperienceItem, i: number) => (
                                <div key={i} className="form-section item-card">
                                    <div className="item-card-header">
                                        <h4 className="section-label">Achievement #{i + 1}</h4>
                                        <button className="remove-btn" onClick={() => removeListItem('experience', i)}><Minus size={14} /> Remove</button>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Event / Competition Name</label>
                                            <input type="text" value={item.role} onChange={e => updateListItem('experience', i, 'role', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>Organizer / Club</label>
                                            <input type="text" value={item.company} onChange={e => updateListItem('experience', i, 'company', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Year / Period</label>
                                            <input type="text" value={item.period} onChange={e => updateListItem('experience', i, 'period', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>Description</label>
                                            <input type="text" value={item.desc} onChange={e => updateListItem('experience', i, 'desc', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addListItem('experience', { role: '', company: '', period: '', desc: '' })}>
                                <Plus size={16} /> Add Achievement
                            </button>
                        </div>
                    )}

                    {/* ── TECH STACK (Skills) ───────────────────────────────── */}
                    {activeTab === 'skills' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}
                            {editData.skills.map((cat: SkillCategory, ci: number) => (
                                <div key={ci} className="form-section item-card">
                                    <div className="item-card-header">
                                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                            <label>Category Name</label>
                                            <input type="text" value={cat.name}
                                                onChange={e => setEditData(prev => {
                                                    const skills = prev.skills.map((c, idx) => idx === ci ? { ...c, name: e.target.value } : c);
                                                    return { ...prev, skills };
                                                })} />
                                        </div>
                                        <button className="remove-btn" style={{ marginTop: '24px' }} onClick={() => removeListItem('skills', ci)}><Minus size={14} /> Remove</button>
                                    </div>
                                    <div className="form-group">
                                        <label>Skills (one per row)</label>
                                        {cat.items.map((item, ii) => (
                                            <div key={ii} className="detail-row">
                                                <input type="text" value={item}
                                                    onChange={e => updateSkillItem(ci, ii, e.target.value)}
                                                    placeholder={`Skill ${ii + 1}`} />
                                                <button className="icon-btn danger" onClick={() => removeSkillItem(ci, ii)}><Minus size={14} /></button>
                                            </div>
                                        ))}
                                        <button className="add-inline-btn" onClick={() => addSkillItem(ci)}><Plus size={14} /> Add Skill</button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addListItem('skills', { name: 'New Category', items: [''] })}>
                                <Plus size={16} /> Add Category
                            </button>
                        </div>
                    )}

                    {/* ── PROJECTS (Portfolio) ──────────────────────────────── */}
                    {activeTab === 'projects' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}
                            {editData.projects.map((project: ProjectItem, i: number) => (
                                <div key={i} className="form-section item-card">
                                    <div className="item-card-header">
                                        <h4 className="section-label">Showcase #{project.showcase}</h4>
                                        <button className="remove-btn" onClick={() => removeListItem('projects', i)}><Minus size={14} /> Remove</button>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Project Title</label>
                                            <input type="text" value={project.title} onChange={e => updateListItem('projects', i, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>Showcase Number</label>
                                            <input type="number" value={project.showcase} onChange={e => updateListItem('projects', i, 'showcase', parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea rows={3} value={project.desc} onChange={e => updateListItem('projects', i, 'desc', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Tags (one per row)</label>
                                        {project.tags.map((tag, ti) => (
                                            <div key={ti} className="detail-row">
                                                <input type="text" value={tag} onChange={e => updateProjectTag(i, ti, e.target.value)} placeholder={`Tag ${ti + 1}`} />
                                                <button className="icon-btn danger" onClick={() => {
                                                    setEditData(prev => {
                                                        const projects = prev.projects.map((p, pi) =>
                                                            pi === i ? { ...p, tags: p.tags.filter((_, idx) => idx !== ti) } : p
                                                        );
                                                        return { ...prev, projects };
                                                    });
                                                }}><Minus size={14} /></button>
                                            </div>
                                        ))}
                                        <button className="add-inline-btn" onClick={() => {
                                            setEditData(prev => {
                                                const projects = prev.projects.map((p, pi) =>
                                                    pi === i ? { ...p, tags: [...p.tags, ''] } : p
                                                );
                                                return { ...prev, projects };
                                            });
                                        }}><Plus size={14} /> Add Tag</button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addListItem('projects', { title: '', desc: '', tags: [''], showcase: editData.projects.length + 1 })}>
                                <Plus size={16} /> Add Project
                            </button>
                        </div>
                    )}

                    {/* ── RESEARCH PAPERS ────────────────────────────────────── */}
                    {activeTab === 'papers' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}
                            {editData.papers.map((paper: PaperItem, i: number) => (
                                <div key={i} className="form-section item-card">
                                    <div className="item-card-header">
                                        <h4 className="section-label">Paper #{i + 1}</h4>
                                        <button className="remove-btn" onClick={() => removeListItem('papers', i)}><Minus size={14} /> Remove</button>
                                    </div>
                                    
                                    <div className="form-group" style={{ background: 'rgba(59,130,246,0.05)', padding: '16px', borderRadius: '12px', border: '1px dashed rgba(59,130,246,0.3)' }}>
                                        <label style={{ color: '#3b82f6' }}>✨ Option 1: Auto-Fill via BibTeX</label>
                                        <textarea rows={4} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} placeholder="@INPROCEEDINGS{..."
                                            value={bibtexInputs[i] || ''} onChange={e => setBibtexInputs({...bibtexInputs, [i]: e.target.value})} 
                                        />
                                        <button className="btn-small btn-secondary" style={{ marginTop: '8px' }} onClick={() => handleParseBibtex(i)}>Parse & Autofill</button>
                                    </div>

                                    <h5 style={{ margin: '24px 0 16px', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Option 2: Manual Entry</h5>
                                    <div className="form-group">
                                        <label>Paper Title</label>
                                        <input type="text" value={paper.title} onChange={e => updateListItem('papers', i, 'title', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Authors</label>
                                        <input type="text" value={paper.authors} onChange={e => updateListItem('papers', i, 'authors', e.target.value)} />
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Venue (Journal / Conf)</label>
                                            <input type="text" value={paper.venue} onChange={e => updateListItem('papers', i, 'venue', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>Year</label>
                                            <input type="text" value={paper.year} onChange={e => updateListItem('papers', i, 'year', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Keywords</label>
                                            <input type="text" value={paper.keywords} onChange={e => updateListItem('papers', i, 'keywords', e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>DOI / URL</label>
                                            <input type="text" value={paper.doi} onChange={e => updateListItem('papers', i, 'doi', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => addListItem('papers', { title: '', authors: '', venue: '', year: '', keywords: '', doi: '' })}>
                                <Plus size={16} /> Add Research Paper
                            </button>
                        </div>
                    )}

                    {/* ── CONTACT DETAILS ─────────────────────────────────── */}
                    {activeTab === 'contact' && (
                        <div className="tab-pane cms-pane">
                            <SaveBar />
                            {saveStatus && <div className="status-badge success">✓ {saveStatus}</div>}

                            <div className="form-section">
                                <h4 className="section-label">General Contact</h4>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={editData.contact.email}
                                        onChange={e => setEditData({ ...editData, contact: { ...editData.contact, email: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" value={editData.contact.phone}
                                        onChange={e => setEditData({ ...editData, contact: { ...editData.contact, phone: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Location / Address</label>
                                    <input type="text" value={editData.contact.location}
                                        onChange={e => setEditData({ ...editData, contact: { ...editData.contact, location: e.target.value } })} />
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="section-label">Social & Messaging Links</h4>
                                <div className="form-group">
                                    <label>WhatsApp Link (e.g. https://wa.me/...)</label>
                                    <input type="text" value={editData.contact.whatsapp}
                                        onChange={e => setEditData({ ...editData, contact: { ...editData.contact, whatsapp: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Messenger Link (e.g. https://m.me/...)</label>
                                    <input type="text" value={editData.contact.messenger}
                                        onChange={e => setEditData({ ...editData, contact: { ...editData.contact, messenger: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Facebook Profile Link</label>
                                    <input type="text" value={editData.contact.facebook}
                                        onChange={e => setEditData({ ...editData, contact: { ...editData.contact, facebook: e.target.value } })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── MANAGE ADMINS ──────────────────────────────────────── */}
                    {activeTab === 'admins' && (
                        <div className="tab-pane">
                            <div className="pane-header">
                                <div>
                                    <h2 className="pane-title">Admin Management</h2>
                                    <p className="pane-desc">Create and manage superuser accounts.</p>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="section-label">Register New Admin</h4>
                                <form onSubmit={handleCreateAdmin}>
                                    <div className="flex-group">
                                        <div className="form-group w-50">
                                            <label>Email Address</label>
                                            <input type="email" required value={newAdminEmail}
                                                onChange={e => setNewAdminEmail(e.target.value)} />
                                        </div>
                                        <div className="form-group w-50">
                                            <label>Password</label>
                                            <input type="password" required value={newAdminPassword}
                                                onChange={e => setNewAdminPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>Create Admin</button>
                                </form>
                            </div>

                            <div className="messages-list">
                                <h4 className="section-label" style={{ marginTop: '20px' }}>Active Admins</h4>
                                {adminsList.map((admin: any) => (
                                    <div key={admin._id} className="message-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="user-info">
                                            <div className="avatar" style={{ background: '#10b981' }}>{admin.email.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <h4 style={{ margin: 0, color: '#f8fafc' }}>{admin.email}</h4>
                                                <p className="meta" style={{ margin: 0 }}>Role: {admin.role}</p>
                                            </div>
                                        </div>
                                        <div className="message-date">
                                            Joined: {new Date(admin.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── SETTINGS ─────────────────────────────────────────── */}
                    {activeTab === 'settings' && (
                        <div className="tab-pane">
                            <h2 className="pane-title">Settings</h2>
                            <div className="dashboard-card full-width" style={{ textAlign: 'center', padding: '80px 20px' }}>
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>⚙️</span>
                                <h3 style={{ color: '#e2e8f0', marginBottom: '8px' }}>Preferences Locked</h3>
                                <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>System configuration is currently read-only.</p>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <style>{`
                .admin-layout { display: flex; min-height: 100vh; background: #030712; }
                .admin-sidebar { width: 260px; background: #0b1120; border-right: 1px solid #1e293b; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
                .sidebar-header { padding: 32px 24px; border-bottom: 1px solid #1e293b; }
                .sidebar-header h2 { font-size: 1.5rem; font-weight: 800; color: #f8fafc; margin-bottom: 8px; }
                .sec-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 700; color: #10b981; background: rgba(16,185,129,0.1); padding: 4px 8px; border-radius: 100px; border: 1px solid rgba(16,185,129,0.2); text-transform: uppercase; letter-spacing: 0.05em; }
                .sec-badge .dot { width: 5px; height: 5px; background: #10b981; border-radius: 50%; box-shadow: 0 0 6px #10b981; }

                .sidebar-group-title { padding: 24px 20px 8px; font-size: 0.7rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
                .sidebar-nav { padding: 0 12px; display: flex; flex-direction: column; gap: 4px; }
                .primary-nav { flex: 1; }
                .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; border-radius: 8px; color: #94a3b8; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: left; position: relative; width: 100%; }
                .nav-item:hover { background: rgba(255,255,255,0.03); color: #e2e8f0; }
                .nav-item.active { background: #1e293b; color: #f8fafc; border-left: 3px solid #3b82f6; border-radius: 0 8px 8px 0; }
                .count-badge { position: absolute; right: 12px; background: #3b82f6; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 100px; }

                .sidebar-footer { padding: 20px 12px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 4px; margin-top: auto; }
                .footer-btn { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; border-radius: 8px; color: #94a3b8; font-size: 0.875rem; font-weight: 600; cursor: pointer; text-align: left; width: 100%; }
                .footer-btn:hover { background: rgba(255,255,255,0.03); color: #f8fafc; }
                .footer-btn.danger:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
                .pwa-badge { margin: 0 0 8px; padding: 10px 14px; background: rgba(59,130,246,0.05); border: 1px dashed rgba(59,130,246,0.2); border-radius: 8px; color: #3b82f6; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }

                .admin-main { flex: 1; padding: 48px; overflow-y: auto; height: 100vh; box-sizing: border-box; background: #030712; }
                .main-content-wrapper { max-width: 960px; margin: 0 auto; }

                .pane-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #1e293b; gap: 16px; flex-wrap: wrap; }
                .pane-title { font-size: 2rem; font-weight: 800; color: #f8fafc; margin-bottom: 8px; }
                .pane-desc { color: #94a3b8; font-size: 0.9375rem; }

                .status-badge.success { display: inline-block; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; padding: 10px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 600; margin-bottom: 24px; }

                /* Form Sections */
                .form-section { background: #0b1120; border: 1px solid #1e293b; border-radius: 16px; padding: 28px; margin-bottom: 20px; }
                .section-label { font-size: 0.875rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
                .flex-group { display: flex; gap: 20px; flex-wrap: wrap; }
                .w-50 { flex: 1; min-width: 200px; }
                .form-group { margin-bottom: 18px; }
                .form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
                .form-group input, .form-group textarea {
                    width: 100%; padding: 11px 14px; border-radius: 8px;
                    border: 1px solid #334155; background: #0f172a; color: #f1f5f9;
                    font-family: inherit; font-size: 0.9375rem;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .form-group textarea { resize: vertical; }

                /* Item Cards */
                .item-card { position: relative; }
                .item-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px; }
                .remove-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; border-radius: 8px; cursor: pointer; font-size: 0.8125rem; font-weight: 600; white-space: nowrap; flex-shrink: 0; transition: 0.2s; }
                .remove-btn:hover { background: rgba(239,68,68,0.15); }
                .add-btn { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: rgba(59,130,246,0.08); border: 1px dashed rgba(59,130,246,0.3); color: #3b82f6; border-radius: 12px; cursor: pointer; font-size: 0.9375rem; font-weight: 600; width: 100%; justify-content: center; transition: 0.2s; margin-top: 8px; }
                .add-btn:hover { background: rgba(59,130,246,0.14); border-color: #3b82f6; }
                .add-inline-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: rgba(59,130,246,0.06); border: 1px dashed rgba(59,130,246,0.25); color: #3b82f6; border-radius: 8px; cursor: pointer; font-size: 0.8125rem; font-weight: 600; transition: 0.2s; margin-top: 8px; }
                .add-inline-btn:hover { background: rgba(59,130,246,0.12); }
                .detail-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
                .detail-row input { flex: 1; }
                .icon-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #334155; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: 0.2s; color: #94a3b8; }
                .icon-btn.danger { border-color: rgba(239,68,68,0.3); color: #ef4444; }
                .icon-btn.danger:hover { background: rgba(239,68,68,0.1); }

                /* Dashboard Grid */
                .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
                .dashboard-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: transform 0.2s; }
                .dashboard-card:hover { transform: translateY(-4px); }
                .card-icon { width: 56px; height: 56px; border-radius: 14px; background: rgba(59,130,246,0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6; flex-shrink: 0; }
                .card-info h3 { font-size: 0.875rem; color: #94a3b8; margin-bottom: 4px; font-weight: 500; }
                .card-info .stat { font-size: 2rem; font-weight: 800; color: #f8fafc; margin: 0; }

                /* Messages */
                .messages-list { display: flex; flex-direction: column; gap: 16px; }
                .message-card { background: #0b1120; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; }
                .message-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
                .user-info { display: flex; gap: 16px; align-items: center; }
                .avatar { width: 40px; height: 40px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0; }
                .user-info h4 { color: #f8fafc; margin-bottom: 4px; }
                .meta { color: #64748b; font-size: 0.8125rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                .message-date { color: #64748b; font-size: 0.8125rem; display: flex; align-items: center; gap: 6px; }
                .message-body { color: #e2e8f0; font-size: 0.9375rem; line-height: 1.6; margin-bottom: 20px; padding: 16px; background: #0f172a; border-radius: 12px; }
                .message-actions { display: flex; gap: 12px; flex-wrap: wrap; }
                .empty-state { text-align: center; padding: 80px 20px; color: #64748b; }
                .empty-state p { margin-top: 16px; }

                /* Buttons */
                .btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; display: flex; align-items: center; gap: 8px; font-size: 0.9375rem; }
                .btn-primary { background: #3b82f6; color: white; }
                .btn-primary:hover { background: #2563eb; }
                .btn-secondary { background: #1e293b; color: #f8fafc; }
                .btn-secondary:hover { background: #293548; }
                .btn-small { padding: 8px 14px; font-size: 0.8125rem; border-radius: 6px; text-decoration: none; display: flex; align-items: center; gap: 6px; font-weight: 600; cursor: pointer; border: none; }
                .btn-danger { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
                .btn-danger:hover { background: #ef4444; color: white; }

                .fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

                /* Mobile */
                .admin-mobile-header { display: none; padding: 16px 24px; background: #0b1120; border-bottom: 1px solid #1e293b; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 900; }
                .admin-mobile-header h2 { font-size: 1.125rem; color: #f8fafc; }
                .sidebar-toggle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #1e293b; border: none; color: white; border-radius: 8px; cursor: pointer; font-size: 1.25rem; }

                @media (max-width: 992px) {
                    .admin-layout { flex-direction: column; }
                    .admin-sidebar { position: fixed; top: 0; left: -280px; z-index: 1000; width: 260px; transition: left 0.3s cubic-bezier(0.4,0,0.2,1); }
                    .admin-sidebar.open { left: 0; }
                    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 950; backdrop-filter: blur(4px); }
                    .admin-mobile-header { display: flex; }
                    .desktop-only { display: none; }
                    .admin-main { padding: 24px 16px; height: auto; overflow-y: visible; }
                    .pane-title { font-size: 1.5rem; }
                }

                @media (max-width: 600px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .pane-header { flex-direction: column; align-items: flex-start; }
                    .flex-group { flex-direction: column; }
                    .w-50 { min-width: unset; }
                    .message-actions { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
