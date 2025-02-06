export interface EducationData {
    title: string;
    educations: Education[];
}

export interface Education {
    school: string;
    degree: string;
    period: string;
    location: string; // Added location field
    score?: string;
    logo: string;
}
