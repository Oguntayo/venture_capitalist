import { promises as fs } from "fs";
import path from "path";
import { Company } from "@/lib/types";
import { CompaniesClient } from "@/app/companies/companies-client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function CompaniesPage() {
    const filePath = path.join(process.cwd(), "data", "companies.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const companies: Company[] = JSON.parse(jsonData);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Discover Companies</h1>
                    <p className="text-slate-500 mt-1">
                        Surface high-signal opportunities across the venture ecosystem.
                    </p>
                </div>

                <CompaniesClient initialCompanies={companies} />
            </div>
        </DashboardLayout>
    );
}
