import { db } from "@/lib/db";
import { companies as companiesTable } from "@/lib/db/schema";
import { Company } from "@/lib/types";

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            console.warn(`⚠️ Query failed, retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
}

export async function getCompanies(): Promise<Company[]> {
    return withRetry(async () => {
        const data = await db.select().from(companiesTable);
        return data.map((c) => ({
            ...c,
            logo_url: c.logoUrl,
            signal_score: c.signalScore,
            funding_rounds: (c.fundingRounds as any) ?? undefined,
            social_links: (c.socialLinks as any) ?? undefined,
            headcount_growth: c.headcountGrowth ?? undefined,
            founders: (c.founders as any) ?? undefined,
            investors: (c.investors as any) ?? undefined,
            tags: (c.tags as any) ?? undefined,
            signals: (c.signals as any) ?? undefined,
            headcount: c.headcount ?? undefined,
            userNotes: c.userNotes ?? undefined,
        }));
    });
}
