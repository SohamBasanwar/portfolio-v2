export interface Achievement {
    id: string;
    title: string;
    status: string;
    category: string;
    date: string;
    previewImage: string;
    abstract: string;
    keyOutcome: string;
}

export const achievementsData: Achievement[] = [
    {
        id: 'cert-tdsp',
        title: 'Transportation Data Science Project (TDSP)',
        status: 'EARNED',
        category: 'Certification',
        date: 'Jan 2025',
        previewImage: '/Soham Basanwar - CERTIFIACTE For TDSP-1.png',
        abstract: 'Certificate of completion for Transportation Data Science Project (TDSP), validating applied data science training.',
        keyOutcome: 'Validated applied data science training in time series + geospatial analysis.'
    },
    {
        id: 'cert-codepath',
        title: 'CodePath Technical Interview Prep (TIP 102)',
        status: 'EARNED',
        category: 'Certification',
        date: 'Dec 2024',
        previewImage: '/CodePath_TIP - Certificate.png',
        abstract: 'Completed CodePath Technical Interview Preparation (TIP 102) at the intermediate level.',
        keyOutcome: 'Validated interview prep competency in data structures / algorithms practice.'
    }
];
