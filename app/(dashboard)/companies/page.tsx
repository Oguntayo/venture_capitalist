import { getCompanies } from "@/lib/db/queries";
import { CompaniesClient } from "./companies-client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Company } from "@/lib/types";

export default async function CompaniesPage() {
    // Fetch companies directly using the shared DB query utility
    let companies: Company[] = [];
    try {
        companies = await getCompanies();
    } catch (error) {
        console.error('❌ Failed to fetch companies:', error);
        // Fallback to empty list to avoid crashing the page
        companies = [];
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <CompaniesClient initialCompanies={companies} />
            </div>
        </DashboardLayout>
    );
}
