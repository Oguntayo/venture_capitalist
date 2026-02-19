"use client";

import { useState, useEffect } from "react";
import { Company } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Trash2,
    ExternalLink,
    ChevronRight,
    FileJson,
    FileSpreadsheet,
    ListPlus
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface List {
    id: string;
    name: string;
    companies: string[];
}

export function ListsClient({ companies }: { companies: Company[] }) {
    const [lists, setLists] = useState<List[]>([]);

    useEffect(() => {
        const savedLists = localStorage.getItem("vc-scout-lists");
        if (savedLists) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLists(JSON.parse(savedLists));
        }
    }, []);

    const deleteList = (id: string) => {
        const updated = lists.filter((l) => l.id !== id);
        setLists(updated);
        localStorage.setItem("vc-scout-lists", JSON.stringify(updated));
    };

    const exportList = (list: List, format: "csv" | "json") => {
        const listCompanies = companies.filter((c) => list.companies.includes(c.id));

        let content = "";
        let mimeType = "";
        const fileName = `${list.name.toLowerCase().replace(/ /g, "_")}.${format}`;

        if (format === "json") {
            content = JSON.stringify(listCompanies, null, 2);
            mimeType = "application/json";
        } else {
            const headers = "Name,Website,Industry,Stage,Funding,Location,Signal Score\n";
            const rows = listCompanies.map(c =>
                `"${c.name}","${c.website}","${c.industry}","${c.stage}","${c.funding}","${c.location}",${c.signal_score}`
            ).join("\n");
            content = headers + rows;
            mimeType = "text/csv";
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.length > 0 ? (
                lists.map((list) => {
                    const listCompanies = companies.filter((c) => list.companies.includes(c.id));
                    return (
                        <Card key={list.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold text-slate-900">{list.name}</CardTitle>
                                <div className="flex gap-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => exportList(list, "csv")}>
                                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                                Export as CSV
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => exportList(list, "json")}>
                                                <FileJson className="mr-2 h-4 w-4" />
                                                Export as JSON
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                        onClick={() => deleteList(list.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                                    {listCompanies.length} Companies
                                </div>
                                <div className="space-y-2">
                                    {listCompanies.slice(0, 5).map((company) => (
                                        <Link
                                            key={company.id}
                                            href={`/companies/${company.id}`}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded border bg-white p-0.5 shrink-0">
                                                    <img src={company.logo_url} alt="" className="h-full w-full object-contain" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{company.name}</span>
                                            </div>
                                            <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                                        </Link>
                                    ))}
                                    {listCompanies.length > 5 && (
                                        <div className="text-xs text-center text-slate-400 pt-2 italic">
                                            + {listCompanies.length - 5} more companies
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })
            ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <ListPlus className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No lists created yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-1">
                        Go to the companies page or a profile to start building your curated lists.
                    </p>
                    <Button asChild className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/companies">Discover Companies</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
