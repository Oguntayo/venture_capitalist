import { promises as fs } from "fs";
import path from "path";
import { Company } from "@/lib/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ListsClient } from "./lists-client";

export default async function ListsPage() {
    const filePath = path.join(process.cwd(), "data", "companies.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const companies: Company[] = JSON.parse(jsonData);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Custom Lists</h1>
                    <p className="text-slate-500 mt-1">
                        Manage your curated collections of companies and export your data.
                    </p>
                </div>

                <ListsClient companies={companies} />
            </div>
        </DashboardLayout>
    );
}
