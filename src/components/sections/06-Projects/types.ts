export interface ProjectData {
    id: number;
    title: string;
    description: string;
    image: string;
}

export interface ProjectsData {
    title: string;
    projects: ProjectData[];
}
