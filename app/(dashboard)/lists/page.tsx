import { Company } from "@/lib/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ListsClient } from "./lists-client";
import { getCompanies } from "@/lib/db/queries";

export default async function ListsPage() {
    let companies: Company[] = [];
    try {
        companies = await getCompanies();
    } catch (error) {
        console.error('❌ Failed to fetch companies for lists:', error);
        companies = [];
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <ListsClient companies={companies} />
            </div>
        </DashboardLayout>
    );
}
