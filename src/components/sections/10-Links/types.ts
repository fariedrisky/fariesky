export interface LinkItem {
    title: string;
    url: string;
    icon: string; // Name of the Lucide icon
}

export interface LinksData {
    title: string;
    links: LinkItem[];
}
