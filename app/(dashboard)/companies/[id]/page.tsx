import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Company } from "@/lib/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DossierHeader } from "./dossier-header";
import { IntelligenceReport } from "./intelligence-report";
import { ResearchNotes } from "./research-notes";
import { BackButton } from "./back-button";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const dbCompany = await db.query.companies.findFirst({
        where: eq(companies.id, id)
    });

    if (!dbCompany) {
        notFound();
    }

    const company: Company = {
        ...dbCompany,
        logo_url: dbCompany.logoUrl,
        signal_score: dbCompany.signalScore,
        funding_rounds: (dbCompany.fundingRounds as any) ?? undefined,
        social_links: (dbCompany.socialLinks as any) ?? undefined,
        headcount_growth: dbCompany.headcountGrowth ?? undefined,
        founders: (dbCompany.founders as any) ?? undefined,
        investors: (dbCompany.investors as any) ?? undefined,
        tags: (dbCompany.tags as any) ?? undefined,
        signals: (dbCompany.signals as any) ?? undefined,
        headcount: dbCompany.headcount ?? undefined,
        userNotes: dbCompany.userNotes ?? undefined,
    };

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-24 max-w-[1200px] mx-auto animate-in fade-in duration-700">
                <BackButton />

                <main className="space-y-16">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-backwards">
                        <DossierHeader company={company} />
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-backwards">
                        <IntelligenceReport companyId={company.id} website={company.website} />
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-backwards">
                        <ResearchNotes companyId={company.id} />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
