import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await db.select().from(companies);
        // Map DB fields back to the expected API format if necessary
        // For now, let's keep it simple and ensure the frontend handles the logoUrl vs logo_url etc.
        // Actually, let's map it to match the previous JSON structure for zero-friction migration.
        const formattedCompanies = data.map(c => ({
            ...c,
            logo_url: c.logoUrl,
            signal_score: c.signalScore,
            funding_rounds: c.fundingRounds,
            social_links: c.socialLinks,
            headcount_growth: c.headcountGrowth,
        }));
        return NextResponse.json(formattedCompanies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
    }
}
