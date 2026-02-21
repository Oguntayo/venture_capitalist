"use client";

import { useState, useEffect } from "react";
import { Company, EnrichmentData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Globe,
    MapPin,
    DollarSign,
    ExternalLink,
    Sparkles,
    TrendingUp,
    ShieldCheck,
    Download,
    FileJson,
    FileSpreadsheet,
    FileText
} from "lucide-react";
import { SaveToListButton } from "./save-to-list-button";
import {
    exportCompanyToExcel,
    exportCompanyToCSV,
    exportCompanyToJSON
} from "@/lib/export";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CompanyHeroProps {
    company: Company;
}

export function CompanyHero({ company }: CompanyHeroProps) {
    const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
    const [currentNotes, setCurrentNotes] = useState<string>(company.userNotes || "");

    useEffect(() => {
        const loadEnrichment = () => {
            const cached = localStorage.getItem(`enrichment-${company.id}`);
            if (cached) {
                try {
                    setEnrichmentData(JSON.parse(cached));
                } catch (e) {
                    console.error("Failed to parse enrichment data", e);
                }
            }
        };

        const loadNotes = () => {
            const cached = localStorage.getItem(`notes-${company.id}`);
            if (cached !== null) {
                setCurrentNotes(cached);
            }
        };

        loadEnrichment();
        loadNotes();

        const handleStorage = (e: StorageEvent) => {
            if (e.key === `enrichment-${company.id}`) {
                loadEnrichment();
            }
            if (e.key === `notes-${company.id}`) {
                loadNotes();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [company.id]);

    const displayScore = enrichmentData?.match_score ?? company.signal_score;
    const isThesisMatch = enrichmentData?.match_score !== undefined;

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-white/5 shadow-2xl group min-h-[460px] flex items-center isolate will-change-transform transform-gpu">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
            </div>

            <div className="relative z-10 p-10 lg:p-14 w-full h-full flex flex-col justify-between gap-12">
                <div className="flex flex-col lg:flex-row gap-12 items-center justify-between h-full">
                    <div className="flex-1 space-y-8 max-w-2xl">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/10 blur-xl rounded-3xl" />
                                <div className="relative h-24 w-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 shadow-2xl flex items-center justify-center transition-all duration-700 group-hover:rotate-3 group-hover:scale-110">
                                    <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain filter brightness-110 contrast-125" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-5xl font-black text-white tracking-tight leading-[1.1] drop-shadow-sm">
                                    {company.name}
                                </h1>
                                <div className="flex items-center gap-3 pt-2">
                                    <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 px-4 py-1.5 font-bold text-xs uppercase tracking-wider">
                                        {company.industry}
                                    </Badge>
                                    <Badge variant="outline" className="text-slate-400 border-white/10 px-4 py-1.5 font-bold text-xs uppercase tracking-wider bg-white/5 backdrop-blur-md">
                                        {company.stage}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300 text-xl leading-relaxed font-medium tracking-tight opacity-90">
                            {company.description}
                        </p>

                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
                            <div className="space-y-2">
                                <div className="flex items-center text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.2em]">
                                    <Globe className="h-3.5 w-3.5 mr-2 opacity-50" />
                                    Base Url
                                </div>
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-slate-100 hover:text-indigo-400 transition-all flex items-center gap-1.5 group/link">
                                    {company.website.replace("https://", "")}
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                </a>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.2em]">
                                    <MapPin className="h-3.5 w-3.5 mr-2 opacity-50" />
                                    HQ Location
                                </div>
                                <div className="text-sm font-black text-slate-100">{company.location}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.2em]">
                                    <DollarSign className="h-3.5 w-3.5 mr-2 opacity-50" />
                                    Capital Raised
                                </div>
                                <div className="text-sm font-black text-slate-100">${company.funding}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] min-w-[340px] relative overflow-hidden group/gauge self-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-transparent opacity-0 group-hover/gauge:opacity-100 transition-all duration-1000" />

                        <div className="relative h-56 w-56 flex items-center justify-center mb-6">
                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                                <circle className="text-white/[0.05]" strokeWidth="8" fill="transparent" r="42" cx="50" cy="50" />
                                <circle
                                    className={cn(
                                        "transition-all duration-1000 ease-in-out drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]",
                                        isThesisMatch ? "text-emerald-500" : "text-indigo-500"
                                    )}
                                    strokeWidth="8"
                                    strokeDasharray={`${displayScore}, 100`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-4 py-1 mb-2 border border-white/5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                                        {isThesisMatch ? "Thesis Alignment" : "Precision Signal"}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">
                                        {displayScore}
                                    </span>
                                    <span className="text-2xl font-black text-slate-500">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full space-y-4 relative z-10">
                            {isThesisMatch ? (
                                <>
                                    <div className="flex items-center justify-center gap-2 text-[11px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 py-1.5 rounded-full border border-emerald-400/20">
                                        <ShieldCheck className="h-4 w-4" />
                                        Locked Intelligence
                                    </div>
                                    <div className="relative px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                        <p className="text-[12px] text-slate-100 font-bold italic leading-relaxed opacity-90">
                                            "{enrichmentData?.match_explanation?.slice(0, 120)}..."
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500/50 rounded-full animate-pulse" style={{ width: '70%' }} />
                                    </div>
                                    <p className="text-[10px] text-center font-black text-slate-500 uppercase tracking-widest">
                                        Awaiting Deep Scan Intelligence
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-auto">
                    <div className="flex gap-4">
                        <SaveToListButton companyId={company.id} companyName={company.name} />
                        <Button
                            variant="outline"
                            className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:border-indigo-500/50 transition-all font-black uppercase tracking-widest text-xs shadow-xl active:scale-95"
                            onClick={() => {
                                document.getElementById('run-deep-scan')?.click()
                            }}
                        >
                            <Sparkles className="mr-3 h-5 w-5 text-indigo-400" />
                            Run Deep Scan
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-14 w-14 p-0 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:border-emerald-500/50 transition-all shadow-xl active:scale-95 group/export"
                                >
                                    <Download className="h-5 w-5 text-emerald-400 group-hover/export:scale-110 transition-transform" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50">
                                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">
                                    Export Intelligence
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem
                                    onClick={() => exportCompanyToExcel({ ...company, userNotes: currentNotes }, enrichmentData)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-200 focus:bg-white/5 focus:text-emerald-400 transition-colors cursor-pointer"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    <span className="text-xs font-bold">Excel Report (.xlsx)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => exportCompanyToCSV({ ...company, userNotes: currentNotes }, enrichmentData)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-200 focus:bg-white/5 focus:text-indigo-400 transition-colors cursor-pointer"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span className="text-xs font-bold">Structured CSV (.csv)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => exportCompanyToJSON({ ...company, userNotes: currentNotes }, enrichmentData)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-200 focus:bg-white/5 focus:text-amber-400 transition-colors cursor-pointer"
                                >
                                    <FileJson className="h-4 w-4" />
                                    <span className="text-xs font-bold">Raw JSON Data (.json)</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5">
                        <div className={cn(
                            "h-2 w-2 rounded-full",
                            isThesisMatch ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-indigo-500 animate-pulse"
                        )} />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            {isThesisMatch ? "Intelligence Analysis Active" : "Momentum Monitoring Ready"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
