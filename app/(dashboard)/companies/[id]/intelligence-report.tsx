"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Sparkles,
    Zap,
    Lock,
    FileText,
    Globe,
    ChevronRight,
    Search,
    ShieldCheck,
    BarChart3,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import { EnrichmentData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ThesisModal } from "@/components/thesis/thesis-modal";

interface IntelligenceReportProps {
    companyId: string;
    website: string;
}

export function IntelligenceReport({ companyId, website }: IntelligenceReportProps) {
    const [data, setData] = useState<EnrichmentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [userThesis, setUserThesis] = useState<string | null>(null);
    const [thesisLoading, setThesisLoading] = useState(true);
    const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Initializing Intelligence...");

    useEffect(() => {
        const cached = localStorage.getItem(`enrichment-${companyId}`);
        if (cached) {
            try { setData(JSON.parse(cached)); } catch { }
        }

        fetch("/api/user/thesis")
            .then(res => res.json())
            .then(d => setUserThesis(d.thesis || null))
            .finally(() => setThesisLoading(false));
    }, [companyId]);

    // Status message cycling effect
    useEffect(() => {
        if (!loading) return;

        const messages = [
            "Initializing Institutional Intelligence...",
            "Bypassing Security Layers...",
            "Scraping Market Data & Social Signals...",
            "Neural Pattern Matching against Thesis...",
            "Synthesizing Investment Rationale...",
            "Engaging Dossier Finalization..."
        ];

        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % messages.length;
            setStatusMessage(messages[i]);
        }, 1500);

        return () => clearInterval(interval);
    }, [loading]);

    const handleEnrich = async () => {
        if (data) {
            setRefreshing(true);
        } else {
            setLoading(true);
            setStatusMessage("Initializing Intelligence...");
        }
        try {
            const res = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyId, website }),
            });
            const enrichedData = await res.json();
            setData(enrichedData);
            localStorage.setItem(`enrichment-${companyId}`, JSON.stringify(enrichedData));
            window.dispatchEvent(new StorageEvent("storage", {
                key: `enrichment-${companyId}`,
                newValue: JSON.stringify(enrichedData),
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (thesisLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-2 w-24" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="h-48 rounded-[2.5rem] md:col-span-2" />
                    <Skeleton className="h-48 rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">Thesis Alignment</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculated Intelligence</p>
                    </div>
                </div>
                {!data && !loading && (
                    <Button onClick={handleEnrich} className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all transform-gpu hover:scale-105">
                        <Zap className="h-3.5 w-3.5 mr-2" />
                        Initiate Scan
                    </Button>
                )}
                {data && !loading && (
                    <Button
                        onClick={handleEnrich}
                        variant="outline"
                        disabled={refreshing}
                        className="border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all group min-w-[140px]"
                    >
                        {refreshing ? (
                            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin text-indigo-500" />
                        ) : (
                            <Zap className="h-3.5 w-3.5 mr-2 text-indigo-500 group-hover:animate-pulse" />
                        )}
                        {refreshing ? "Refreshing..." : "Refresh Scan"}
                    </Button>
                )}
            </div>

            {loading && !data ? (
                <div className="flex flex-col items-center justify-center py-24 border border-slate-100 border-dashed rounded-[3rem] bg-slate-50/50 animate-in fade-in duration-500">
                    <div className="relative h-20 w-20 mb-8">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-[2rem]"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-[2rem] animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-indigo-600 animate-pulse" />
                    </div>
                    <div className="space-y-3 text-center">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest animate-pulse">{statusMessage}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Neural Synchronization Active</p>
                    </div>
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <ChevronRight className="h-3 w-3 text-indigo-500" />
                                Strategic Summary
                            </h4>
                            <div className="p-8 bg-slate-950 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <p className="text-lg text-slate-200 leading-relaxed font-medium italic opacity-95 relative z-10">
                                    &ldquo;{data.summary}&rdquo;
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <ChevronRight className="h-3 w-3 text-indigo-500" />
                                Capabilities Map
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {data.what_they_do?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm transform-gpu transition-all hover:translate-x-1">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                        <span className="text-xs font-bold text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="space-y-6 p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] flex flex-col items-center text-center shadow-lg transform-gpu transition-all hover:-translate-y-1">
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] italic">Match Logic</h4>
                                <div className="text-6xl font-black text-indigo-950 italic">{data.match_score}%</div>
                            </div>
                            <p className="text-xs text-indigo-900/70 font-bold leading-relaxed italic max-w-xs">
                                {data.match_explanation}
                            </p>
                            <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-indigo-100/50 rounded-full border border-indigo-200">
                                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">High Confidence Signal</span>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <ChevronRight className="h-3 w-3 text-indigo-500" />
                                Source Protocol
                            </h4>
                            <div className="space-y-2">
                                {data.sources?.slice(0, 3).map((source, i) => (
                                    <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl transition-colors hover:bg-slate-50 group cursor-pointer">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="text-[10px] font-bold text-slate-600 truncate">{source.url.replace("https://", "").replace("www.", "")}</span>
                                        </div>
                                        <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 border border-slate-100 border-dashed rounded-[3rem] bg-slate-50/50 group transition-all hover:bg-slate-50">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Lock className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Institutional Lockdown</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Intelligence Synthesis Required</p>
                    <Button onClick={handleEnrich} className="bg-slate-900 hover:bg-indigo-600 text-white h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95">
                        <Zap className="h-4 w-4 mr-2" />
                        Execute Strategic Scan
                    </Button>
                </div>
            )}
        </div>
    );
}
