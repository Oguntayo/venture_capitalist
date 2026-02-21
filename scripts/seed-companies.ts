import "dotenv/config";
import { db } from "../lib/db";
import { companies } from "../lib/db/schema";
import fs from "fs";
import path from "path";

async function seed() {
    console.log("🌱 Starting company seeding...");

    const filePath = path.join(process.cwd(), "data", "companies.json");
    const companiesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(`📊 Found ${companiesData.length} companies to seed.`);

    for (const company of companiesData) {
        try {
            await db.insert(companies).values({
                id: company.id,
                name: company.name,
                website: company.website,
                description: company.description,
                industry: company.industry,
                stage: company.stage,
                location: company.location,
                logoUrl: company.logo_url,
                funding: company.funding,
                founded: company.founded,
                signalScore: company.signal_score,
                founders: company.founders,
                investors: company.investors,
                tags: company.tags,
                fundingRounds: company.funding_rounds,
                headcount: company.headcount,
                headcountGrowth: company.headcount_growth,
                socialLinks: company.social_links,
                signals: company.signals,
            }).onConflictDoUpdate({
                target: companies.id,
                set: {
                    name: company.name,
                    website: company.website,
                    description: company.description,
                    industry: company.industry,
                    stage: company.stage,
                    location: company.location,
                    logoUrl: company.logo_url,
                    funding: company.funding,
                    founded: company.founded,
                    signalScore: company.signal_score,
                    founders: company.founders,
                    investors: company.investors,
                    tags: company.tags,
                    fundingRounds: company.funding_rounds,
                    headcount: company.headcount,
                    headcountGrowth: company.headcount_growth,
                    socialLinks: company.social_links,
                    signals: company.signals,
                    updatedAt: new Date(),
                },
            });
        } catch (error) {
            console.error(`❌ Error seeding company ${company.name}:`, error);
        }
    }

    console.log("✅ Seeding completed successfully.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("💥 Fatal error during seeding:", err);
    process.exit(1);
});
