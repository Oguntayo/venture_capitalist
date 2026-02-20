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
    // Harmonic-Grade Expansion
    founders?: { name: string; linkedin?: string; bio?: string }[];
    investors?: { name: string; logo?: string }[];
    tags?: string[];
    funding_rounds?: { stage: string; amount: string; date: string; lead_investor?: string }[];
    headcount?: number;
    headcount_growth?: number; // percentage
    social_links?: { linkedin?: string; twitter?: string; crunchbase?: string };
    signals?: { type: string; value: string; importance: "high" | "medium" | "low" }[];
}

export interface EnrichmentData {
    summary: string;
    what_they_do: string[];
    keywords: string[];
    signals: string[];
    match_score?: number;
    match_explanation?: string;
    sources: { url: string; timestamp: string }[];
}
