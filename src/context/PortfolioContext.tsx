import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface SkillCategory {
    name: string;
    items: string[];
}

export interface EducationItem {
    degree: string;
    school: string;
    year: string;
    major: string;
}

export interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    desc: string;
}

export interface WorkItem {
    role: string;
    company: string;
    startDate: string; // ISO format (e.g., 2022-01-03)
    endDate?: string;  // ISO format, null/empty = "Ongoing"
    details: string[];
}

export interface ProjectItem {
    title: string;
    desc: string;
    tags: string[];
    showcase: number;
}

export interface BlogItem {
    title: string;
    date: string;
    category: string;
}

export interface PortfolioData {
    hero: {
        name: string;
        title: string;
        description: string;
    };
    about: {
        bio: string;
        age: string;
        projects: string;
    };
    skills: SkillCategory[];
    education: EducationItem[];
    experience: ExperienceItem[];
    work: WorkItem[];
    projects: ProjectItem[];
    blog: BlogItem[];
    contact: {
        email: string;
        phone: string;
        location: string;
        whatsapp: string;
        messenger: string;
        facebook: string;
    };
}

const defaultData: PortfolioData = {
    hero: {
        name: "Shah Abdul Mazid",
        title: "Machine Learning Researcher & Software Engineer",
        description: "A CSE student focused on Intelligent Systems & Data Science."
    },
    about: {
        bio: "I am a Computer Science and Engineering student majoring in Intelligent Systems and Data Science at East West University.\n\nPassionate about AI innovation, research, and hackathon projects. Skilled in deep learning, computer vision, NLP, and ML deployment with strong analytical and research abilities.\n\nMy journey in AI and Data Science revolves around developing intelligent systems that solve real-world problems. With a strong foundation in Computer Science, I aim to contribute to research, innovation, and impactful projects.",
        age: "24",
        projects: "10+"
    },
    skills: [
        { name: 'Programming Languages', items: ['Python', 'Java', 'C/C++', 'SQL', 'JavaScript'] },
        { name: 'AI/ML & Data Science', items: ['Deep Learning', 'Computer Vision', 'NLP', 'TensorFlow', 'PyTorch'] },
        { name: 'Development', items: ['FastAPI', 'Flask', 'Java Swing', 'Streamlit', 'Docker', 'Vercel'] },
        { name: 'Tools', items: ['Git', 'Research', 'Academic Writing', 'Latex'] }
    ],
    education: [
        { degree: 'B.Sc. in Computer Science & Engineering', school: 'East West University', year: '2021 – 2026', major: 'Major: Intelligent Systems & Data Science' },
        { degree: 'Higher Secondary Certificate (HSC)', school: 'Dhaka Ideal College', year: '2018 – 2020', major: 'Science' },
        { degree: 'Secondary School Certificate (SSC)', school: 'Badshah Faisal Institute', year: '2016 – 2018', major: 'Science' }
    ],
    experience: [
        { role: 'Network War', company: 'EWU Telecommunication Club', period: '2024', desc: 'Participated in the specialized networking competition.' },
        { role: 'IT Olympiad', company: 'CSE FEST 2024', period: '2024', desc: 'Department of Computer Science & Engineering, East West University.' },
        { role: 'In House Programming Battle', company: 'EWUCoPC', period: '2022', desc: 'Certified participant in the campus-wide coding battle.' }
    ],
    work: [
        { role: 'Campus Ambassador', company: 'eshikhon', startDate: '2022-01-03', endDate: '2025-12-30', details: ['Represented the organization on campus.', 'Organized tech workshops and events.', 'Promoted digital learning among students.'] },
        { role: 'Software Engineer', company: 'softvence Omega', startDate: '2026-02-01', endDate: '', details: ['Developing innovative AI solutions.', 'Implementing premium web architectures.', 'Contributing to research projects.'] }
    ],
    projects: [
        { title: 'AI-Powered E-Commerce Customer Support Chatbot', desc: 'This project implements an AI-powered customer support chatbot for an e-commerce store using n8n, OpenAI, Pinecone, and Shopify.', tags: ['n8n', 'OpenAI', 'Pinecone', 'Shopify'], showcase: 1 },
        { title: 'Competitive Intelligence Workflow Automation', desc: 'Automated competitive intelligence workflow using n8n, Jungle Scout, and web scraping techniques.', tags: ['n8n', 'Jungle Scout', 'Scraping'], showcase: 2 },
        { title: 'VAID: Aerial Image Dataset', desc: 'An Aerial Image Dataset for Vehicle Detection research project targeting high-altitude surveillance.', tags: ['Aerial Imaging', 'Detection', 'Dataset'], showcase: 3 },
        { title: 'Library Management System', desc: 'A robust database project implemented with full CRUD operations and secure user authentication.', tags: ['SQL', 'Database'], showcase: 4 },
        { title: 'Hate Speech Detection from Live Stream', desc: 'This project implements a real-time hate speech detection system for live audio streams using BERT, PyAudio, and TensorFlow.', tags: ['BERT', 'PyAudio', 'TensorFlow'], showcase: 5 },
        { title: 'Mechanical Glove Mouse: Motion-Based Control', desc: 'Motion-controlled wireless glove mouse for human-computer interaction using ESP32-S3 and MPU6050 sensor.', tags: ['ESP32-S3', 'MPU6050', 'Arduino IDE'], showcase: 6 }
    ],
    blog: [
        { title: 'The Future of Web Development', date: 'Mar 15, 2024', category: 'Tech' },
        { title: 'Mastering React Performance', date: 'Feb 28, 2024', category: 'Coding' }
    ],
    contact: {
        email: "shahabdulmazid.ezan@yahoo.com",
        phone: "+880 1531-329222",
        location: "Mohammadpur, Dhaka-1207",
        whatsapp: "https://wa.me/8801531329222",
        messenger: "https://m.me/shahabdulmazid.ezan",
        facebook: "https://facebook.com/shahabdulmazid.ezan"
    }
};

interface PortfolioContextType {
    data: PortfolioData;
    updateData: (newData: PortfolioData) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<PortfolioData>(defaultData);

    useEffect(() => {
        const savedData = localStorage.getItem('portfolio_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Deep merge contact specifically to ensure new fields aren't lost if old data exists
                setData({ 
                    ...defaultData, 
                    ...parsed,
                    contact: {
                        ...defaultData.contact,
                        ...(parsed.contact || {})
                    }
                });
            } catch (error) {
                console.error("Failed to parse portfolio data from localStorage");
                setData(defaultData);
            }
        }
    }, []);

    const updateData = (newData: PortfolioData) => {
        setData(newData);
        localStorage.setItem('portfolio_data', JSON.stringify(newData));
    };

    return (
        <PortfolioContext.Provider value={{ data, updateData }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
};
