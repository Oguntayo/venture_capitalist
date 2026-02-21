"use client";

import { Company, EnrichmentData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Download,
    FileSpreadsheet,
    FileText as FileTextIcon,
    FileJson,
    Globe,
    Users,
    Calendar,
    MapPin,
    ArrowUpRight,
    Search,
    Plus
} from "lucide-react";
import { exportCompanyToExcel, exportCompanyToCSV, exportCompanyToJSON } from "@/lib/export";
import { useState, useEffect } from "react";
import { AddToListDropdown } from "@/components/lists/add-to-list-dropdown";

interface DossierHeaderProps {
    company: Company;
}

export function DossierHeader({ company }: DossierHeaderProps) {
    const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
    const [currentNotes, setCurrentNotes] = useState<string>("");

    useEffect(() => {
        const loadSyncData = () => {
            const cachedEnrichment = localStorage.getItem(`enrichment-${company.id}`);
            if (cachedEnrichment) {
                try { setEnrichmentData(JSON.parse(cachedEnrichment)); } catch (e) { }
            }
            const cachedNotes = localStorage.getItem(`notes-${company.id}`);
            if (cachedNotes !== null) setCurrentNotes(cachedNotes);
        };

        loadSyncData();

        const handleStorage = (e: StorageEvent) => {
            if (e.key === `enrichment-${company.id}` || e.key === `notes-${company.id}`) {
                loadSyncData();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [company.id]);

    const handleExport = (type: 'excel' | 'csv' | 'json') => {
        const payload = { ...company, userNotes: currentNotes };
        if (type === 'excel') exportCompanyToExcel(payload, enrichmentData);
        if (type === 'csv') exportCompanyToCSV(payload, enrichmentData);
        if (type === 'json') exportCompanyToJSON(payload, enrichmentData);
    };

    return (
        <div className="bg-white border-b border-slate-100 p-6 md:p-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shadow-sm transform-gpu transition-transform hover:scale-105 cursor-pointer">
                            <img src={company.logo_url} alt={company.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
                                {company.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                    <Globe className="h-3.5 w-3.5" />
                                    {company.website.replace("https://", "").replace("www.", "")}
                                    <ArrowUpRight className="h-3 w-3" />
                                </a>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{company.industry}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-base md:text-xl text-slate-600 max-w-3xl font-medium leading-relaxed italic">
                        &ldquo;{company.description}&rdquo;
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{company.location}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{company.headcount ?? 'N/A'} Employees</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Est. {company.founded}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:pb-2">
                    <AddToListDropdown companyId={company.id}>
                        <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 h-12 md:h-14 px-4 md:px-6 rounded-2xl font-black uppercase tracking-[0.1em] text-[10px] md:text-xs transition-all shadow-sm flex-1 md:flex-none">
                            <Plus className="mr-2 h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            Add to List
                        </Button>
                    </AddToListDropdown>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-slate-900 hover:bg-black text-white px-4 md:px-8 h-12 md:h-14 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] md:text-xs shadow-xl transition-all flex-1 md:flex-none">
                                <Download className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5" />
                                <span className="hidden xs:inline">Export Dossier</span>
                                <span className="xs:hidden">Export</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-slate-100 shadow-2xl bg-white/95 backdrop-blur-xl">
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Select Format</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExport('excel')} className="flex items-center gap-3 px-3 py-3 rounded-xl focus:bg-slate-50 cursor-pointer">
                                <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-bold text-slate-700">Excel Analysis (.xlsx)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('csv')} className="flex items-center gap-3 px-3 py-3 rounded-xl focus:bg-slate-50 cursor-pointer">
                                <FileTextIcon className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs font-bold text-slate-700">CSV Structure (.csv)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('json')} className="flex items-center gap-3 px-3 py-3 rounded-xl focus:bg-slate-50 cursor-pointer">
                                <FileJson className="h-4 w-4 text-amber-500" />
                                <span className="text-xs font-bold text-slate-700">Raw JSON Schema (.json)</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[10px] font-black text-indigo-400 leading-none uppercase tracking-tighter mb-0.5">Match</span>
                        <span className="text-lg font-black text-indigo-700 leading-none">{enrichmentData?.match_score ?? '--'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
