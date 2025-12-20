export interface Project {
    id: string;
    title: string;
    status: string;
    category: string;
    previewImage: string;
    tech: string[];
    abstract: string;
    keyOutcome: string;
    demoLink?: string;
    githubLink?: string;
    galleryImages?: string[];
}

export const projectsData: Project[] = [
    {
        id: 'persist-ai',
        title: 'PersistAI — Intelligent Resume Builder',
        status: 'COMPLETED',
        category: 'AI / Career Tech',
        previewImage: '/PersistAI.png',
        tech: ['React Native', 'Expo', 'Flask', 'AI Matching', 'PDF Gen'],
        abstract: 'Full-stack AI resume builder that automatically matches a candidate’s resume entries to a job description and generates a polished, ATS-optimized resume PDF. It includes detailed analysis scoring and automated formatting.',
        keyOutcome: 'End-to-end system demonstrated resume-to-JD matching + automated ATS-style PDF output.',
        demoLink: 'https://youtu.be/LUslo5eH1Ac?si=Si9cHhpcEFh6nGfT',
        githubLink: 'https://github.com/SohamBasanwar/PersistAI'
    },
    {
        id: 'saya-chatbot',
        title: 'Saya — Emotional AI Chatbot',
        status: 'COMPLETED',
        category: 'AI / Conversational',
        previewImage: '/Saya_start_page.png',
        galleryImages: ['/Saya_chat_page.png'],
        tech: ['Python', 'OpenAI API', 'FastAPI', 'Emotion Engine'],
        abstract: 'Emotionally responsive chatbot built using Python and the OpenAI API, designed to simulate human-like interaction through emotion-driven conversations and adaptive responses.',
        keyOutcome: 'Demonstrated emotion-aware conversational behavior with an API-driven backend.',
        githubLink: 'https://github.com/SohamBasanwar/Saya'
    },
    {
        id: 'portfolio-website',
        title: 'Portfolio Website (V1)',
        status: 'ARCHIVED',
        category: 'Web / Frontend',
        previewImage: '/Portfolio_v1.png',
        tech: ['React', 'HTML', 'CSS', 'Bootstrap', 'Animations'],
        abstract: 'Personal portfolio website built with React, HTML, CSS, Bootstrap, and JavaScript to showcase skills and projects, with animations and effects added across the UI. Includes CI/CD workflows via GitHub Actions.',
        keyOutcome: 'Shipped an interactive portfolio site with consistent animated UI presentation.',
        demoLink: 'https://sohambasanwar.netlify.app/',
        githubLink: 'https://github.com/SohamBasanwar/Portfolio'
    },
    {
        id: 'portfolio-v2',
        title: 'Portfolio V2 — Biotech Edition',
        status: 'LIVE',
        category: 'Web / Creative Dev',
        previewImage: '/Portfolio_v2.png',
        tech: ['React', 'Three.js', 'R3F', 'Framer Motion', 'TypeScript'],
        abstract: 'The current 3D immersive portfolio featuring a "Biotech Microscope" theme. Implements custom WebGL physics simulations, interactive 3D components like the Capabilities Cylinder, and a state-managed guide actor system, fully typed in TypeScript.',
        keyOutcome: 'Deployed a highly interactive, theme-consistent 3D portfolio with custom physics.',
        githubLink: 'https://github.com/SohamBasanwar/Portfolio_v2'
    },
    {
        id: 'personal-expense-manager',
        title: 'Personal Expense Manager',
        status: 'COMPLETED',
        category: 'Systems / C++',
        previewImage: '/PEM.png',
        tech: ['C++', 'File I/O', 'GUI'],
        abstract: 'Designed and implemented the backend of a personal expense management application in C++ to track and categorize expenses, including a file-based storage system to save and organize user expenses.',
        keyOutcome: 'Implemented structured expense tracking with persistent local storage in C++.'
    },
    {
        id: 'tdsp',
        title: 'Transportation Data Science',
        status: 'CERTIFIED',
        category: 'Data Science / Safety',
        previewImage: '/TDSP.png',
        tech: ['Python', 'Google Colab', 'Pandas', 'Time Series', 'Geospatial', 'Matplotlib'],
        abstract: 'Built end-to-end Python workflows for data cleaning, feature creation, and time-series + geospatial analysis; identified high-risk hotspots and trend patterns and summarized targeted safety recommendations.',
        keyOutcome: 'Produced evidence-backed hotspot/trend insights with map visualizations and actionable recommendations.',
        demoLink: 'https://colab.research.google.com/drive/1Uj7I6AlhjTPTTqzSD_AMjYUuQm-j3G1V?usp=sharing',
        githubLink: 'https://github.com/SohamBasanwar/TDSP'
    },
    {
        id: 'adopt-a-scientist',
        title: 'Adopt a Scientist Project',
        status: 'COMPLETED',
        category: 'Research / Collaboration',
        previewImage: '/Adopt a Scientist.png',
        tech: ['Research', 'Project Mgmt', 'Bio-Genetics Context'],
        abstract: 'Collaborated on the "Adopt a Scientist" project for BIOS 110, focusing on Dr. Debra Dianne Murray’s research in Human Genetics; coordinated team efforts and ensured milestones were met on schedule.',
        keyOutcome: 'Delivered a coordinated research-focused class project with on-time milestones.'
    }
];
