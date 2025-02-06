export interface ExperienceData {
    title: string;
    experiences: Experience[];
}

export interface Experience {
    company: string;
    role: string;
    period: string;
    location: string; // Added location field
    description: string[];
    logo?: string;
}
