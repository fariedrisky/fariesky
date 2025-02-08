export interface ProjectData {
    id: number;
    title: string;
    description: string;
    image: string[];
    url: string;
    techStack?: string[];
    features?: string[];
    date?: string;
}

export interface ProjectsData {
    title: string;
    projects: ProjectData[];
}
