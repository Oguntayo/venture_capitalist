"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Clock, ExternalLink, Zap, Lock, FileText, TrendingUp, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EnrichmentData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ThesisModal } from "@/components/thesis/thesis-modal";

interface EnrichmentCardProps {
    companyId: string;
    website: string;
}

export function EnrichmentCard({ companyId, website }: EnrichmentCardProps) {
    const [data, setData] = useState<EnrichmentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userThesis, setUserThesis] = useState<string | null>(null);
    const [thesisLoading, setThesisLoading] = useState(true);
    const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);

    const fetchThesis = async () => {
        try {
            const res = await fetch("/api/user/thesis");
            if (!res.ok) throw new Error("Failed to fetch thesis");
            const d = await res.json();

            setUserThesis(d.thesis || null);
        } catch (err) {
            console.error(err);
            setUserThesis(null);
        } finally {
            setThesisLoading(false);
        }
    };
    useEffect(() => {
        const cached = localStorage.getItem(`enrichment-${companyId}`);
        if (cached) {
            try { setData(JSON.parse(cached)); } catch { }
        }
        fetchThesis();
    }, [companyId]);

    const handleSaveThesis = (newThesis: string) => {
        setUserThesis(newThesis);
        setIsThesisModalOpen(false);
    };

    const handleEnrich = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyId, website }),
            });

            if (!res.ok) throw new Error("Failed to enrich company profile");

            const enrichedData = await res.json();
            setData(enrichedData);

            localStorage.setItem(`enrichment-${companyId}`, JSON.stringify(enrichedData));
            window.dispatchEvent(new StorageEvent("storage", {
                key: `enrichment-${companyId}`,
                newValue: JSON.stringify(enrichedData),
            }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // No thesis — show premium locked state
    if (!thesisLoading && !userThesis) {
        return (
            <div className="h-[calc(100vh-130px)] min-h-[500px]">
                <Card className="relative overflow-hidden border-indigo-100 bg-white shadow-2xl rounded-3xl h-full border border-slate-100">
                    <div className="absolute top-0 right-0 p-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-indigo-500 border-indigo-200 bg-indigo-50">
                            Locked Intelligence
                        </Badge>
                    </div>
                    <CardHeader className="text-center pt-12 pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                                <div className="relative rounded-2xl bg-indigo-600 p-4 text-white shadow-xl">
                                    <Lock className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Thesis Alignment Required</CardTitle>
                        <p className="text-slate-500 mt-3 max-w-[320px] mx-auto text-sm leading-relaxed font-medium">
                            Our AI requires your <span className="text-indigo-600 font-bold">Investment Thesis</span> to calculate personalized match scores and extract relevant signals.
                        </p>
                    </CardHeader>
                    <CardContent className="pb-12 flex justify-center">
                        <Button
                            onClick={() => setIsThesisModalOpen(true)}
                            className="bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            <Sparkles className="mr-3 h-5 w-5 text-indigo-400" />
                            Initialize Intelligence
                        </Button>
                    </CardContent>
                </Card>
                <ThesisModal
                    isOpen={isThesisModalOpen}
                    onClose={() => setIsThesisModalOpen(false)}
                    currentThesis=""
                    onSave={handleSaveThesis}
                />
            </div>
        );
    }

    if (!data && !loading && !error) {
        return (
            <div className="h-[calc(100vh-130px)] min-h-[500px]">
                <Card className="relative overflow-hidden border-indigo-100 bg-indigo-50/20 rounded-3xl border-dashed border-2 group h-full">
                    <CardHeader className="text-center pt-12 pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="relative group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full animate-pulse" />
                                <div className="relative rounded-full bg-white border border-indigo-100 p-5 text-indigo-600 shadow-xl">
                                    <Zap className="h-10 w-10 fill-indigo-100" />
                                </div>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Live Intelligence Pull</CardTitle>
                        <p className="text-slate-500 mt-3 max-w-[300px] mx-auto text-sm leading-relaxed font-medium">
                            Initiate a <span className="text-indigo-600 font-bold">Deep Scan</span> of the company's ecosystem to generate an explainable thesis match.
                        </p>
                    </CardHeader>
                    <CardContent className="pb-12 flex flex-col items-center gap-4">
                        <Button
                            id="run-deep-scan"
                            onClick={handleEnrich}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:shadow-indigo-500/25"
                        >
                            <Zap className="mr-3 h-5 w-5" />
                            Run Deep Scan
                        </Button>
                        <a href={website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                            Preview Target Domain <ExternalLink className="h-3 w-3" />
                        </a>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <Card className="border-slate-200 shadow-2xl overflow-hidden h-[calc(100vh-130px)] min-h-[500px] flex flex-col rounded-3xl bg-white relative isolate will-change-transform">
            {loading && (
                <div className="absolute inset-0 bg-white/95 z-50 flex items-center justify-center p-8 text-center animate-in fade-in duration-300">
                    <div className="space-y-8 max-w-xs scale-110">
                        <div className="relative mx-auto h-24 w-24">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100/50" />
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-[spin_0.8s_linear_infinite]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Engaging Neutral Cluster...</h3>
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3 text-xs font-bold text-emerald-500 bg-emerald-50/50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Synchronizing Domain Vectors
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-indigo-500 bg-indigo-50/50 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm animate-pulse">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    Extracting Growth Signals
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 bg-slate-50/50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                    Synthesizing Match Logic
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CardHeader className="bg-slate-950 border-b border-white/10 py-5 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.03] rounded-full -mr-16 -mt-16" />
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">
                            Neural Intelligence Pull
                        </CardTitle>
                        <h2 className="text-white text-xl font-black tracking-tight italic uppercase">Deep Scan Report</h2>
                    </div>
                    {!loading && (
                        <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-5 p-6 overflow-y-auto custom-scrollbar">
                {error ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="bg-rose-50 p-3 rounded-full w-fit mx-auto">
                            <AlertCircle className="h-8 w-8 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-slate-900">Enrichment Failed</p>
                            <p className="text-sm text-slate-500 mt-1">{error}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleEnrich} className="rounded-xl border-slate-200 font-bold">
                            Force Re-run
                        </Button>
                    </div>
                ) : data && (
                    <>
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="h-3 w-3 text-indigo-500" />
                                Intelligence Summary
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                                {data.summary}
                            </p>
                        </div>

                        <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capabilities Map</h3>
                            <div className="grid grid-cols-1 gap-1.5">
                                {data.what_they_do.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex gap-2 text-xs font-bold text-slate-700">
                                        <div className="h-4 w-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-black shrink-0">
                                            {i + 1}
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                                {data.keywords.slice(0, 6).map((kw, i) => (
                                    <Badge key={i} variant="secondary" className="bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider">
                                        {kw}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Thesis Match</h3>
                                <div className="text-base font-black text-indigo-600">{data.match_score}%</div>
                            </div>
                            <div className="p-4 rounded-xl bg-indigo-950 text-white shadow-lg">
                                <p className="text-[11px] font-bold leading-relaxed italic opacity-90">
                                    &ldquo;{data.match_explanation || "Strong signal alignment."}&rdquo;
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>

            {!loading && data && (
                <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col gap-3">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sources</h3>
                            <span className="text-[9px] font-bold text-slate-400">{data.sources.length} Verified</span>
                        </div>
                        <div className="space-y-1.5">
                            {data.sources.slice(0, 2).map((source, i) => (
                                <div key={i} className="flex items-center justify-between text-[10px] p-2 rounded-lg bg-white border border-slate-200">
                                    <div className="flex items-center text-slate-900 font-bold truncate max-w-[150px]">
                                        <Globe className="h-3 w-3 mr-1.5 text-slate-400" />
                                        {source.url.replace("https://", "").replace("www.", "")}
                                    </div>
                                    <div className="text-slate-400">{source.timestamp}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        id="run-deep-scan"
                        variant="ghost"
                        size="sm"
                        onClick={handleEnrich}
                        className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-white"
                    >
                        Refresh Intelligence
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
