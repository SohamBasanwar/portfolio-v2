export interface Experience {
    id: string;
    company: string;
    role: string;
    status: 'INCOMING' | 'CURRENT' | 'PAST';
    dateRange: string;
    bullets: string[];
}

export const experienceData: Experience[] = [
    {
        id: 'nstem-2026',
        company: 'NSTEM',
        role: 'Web & Technology Development Intern',
        status: 'INCOMING',
        dateRange: 'Summer 2026 (3 months)',
        bullets: [
            'Accepted Web & Technology Development Intern for Summer 2026.',
            'Details and responsibilities will be finalized closer to start.'
        ]
    }
];
