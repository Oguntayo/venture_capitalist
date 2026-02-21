import { db } from "@/lib/db";
import { companies as companiesTable } from "@/lib/db/schema";
import { Company } from "@/lib/types";
import { CompaniesClient } from "./companies-client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function CompaniesPage() {
    const dbCompanies = await db.select().from(companiesTable);

    const companies: Company[] = dbCompanies.map(c => ({
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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <CompaniesClient initialCompanies={companies} />
            </div>
        </DashboardLayout>
    );
}
