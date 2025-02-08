export interface LanguageData {
    title: string;
    languages: Language[];
}

export interface Language {
    name: string;
    level: string;
    logo?: string;
}
