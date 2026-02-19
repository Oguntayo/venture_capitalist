export interface Company {
    id: string;
    name: string;
    website: string;
    description: string;
    industry: string;
    stage: string;
    location: string;
    logo_url: string;
    funding: string;
    founded: number;
    signal_score: number;
}

export interface EnrichmentData {
    summary: string;
    what_they_do: string[];
    keywords: string[];
    signals: string[];
    sources: { url: string; timestamp: string }[];
}
