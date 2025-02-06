export interface CourseData {
    title: string;
    courses: Course[];
}

export interface Course {
    name: string;
    provider: string;
    period: string;
    location: string;
    description: string[];
    logo?: string;
    certificateUrl?: string;
}
