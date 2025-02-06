export interface OrganizationData {
    title: string;
    organizations: Organization[];
}

export interface Organization {
    name: string;
    role: string;
    period: string;
    location: string;
    description: string[];
    logo?: string;
}
