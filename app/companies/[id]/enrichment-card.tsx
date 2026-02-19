"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Clock, ExternalLink, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EnrichmentData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EnrichmentCardProps {
    companyId: string;
    website: string;
}

export function EnrichmentCard({ companyId, website }: EnrichmentCardProps) {
    const [data, setData] = useState<EnrichmentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check localStorage for cached enrichment
        const cached = localStorage.getItem(`enrichment-${companyId}`);
        if (cached) {
            try {
                setData(JSON.parse(cached));
            } catch (e) {
                console.error("Failed to parse cached enrichment", e);
            }
        }
    }, [companyId]);

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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!data && !loading && !error) {
        return (
            <Card className="border-indigo-100 bg-indigo-50/30 overflow-hidden shadow-sm">
                <CardHeader className="text-center pt-8 pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-indigo-100 p-3 text-indigo-600 animate-pulse">
                            <Sparkles className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">Live AI Enrichment</CardTitle>
                    <p className="text-sm text-slate-500 max-w-[280px] mx-auto mt-2">
                        Pull real-time insights, keywords, and business signals directly from the web.
                    </p>
                </CardHeader>
                <CardContent className="pb-8 flex justify-center">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={handleEnrich}
                            disabled={loading}
                            className="flex-1 mr-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Zap className="mr-2 h-4 w-4" />
                            )}
                            {data ? "Refresh Intelligence" : "Live AI Enrichment"}
                        </Button>
                        <Button asChild variant="outline" className="border-slate-200">
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-slate-50/50 border-b py-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                        AI Enterprise Report
                    </CardTitle>
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 pt-6 overflow-y-auto">
                {loading ? (
                    <div className="space-y-4 py-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                        <div className="space-y-1">
                            <p className="font-medium text-slate-900 text-sm">Scraping website content...</p>
                            <p className="text-xs text-slate-400">This usually takes 5-10 seconds</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="py-8 text-center space-y-3">
                        <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
                        <p className="text-sm font-medium text-slate-900">{error}</p>
                        <Button variant="outline" size="sm" onClick={handleEnrich}>Try Again</Button>
                    </div>
                ) : data && (
                    <>
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Executive Summary</h3>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                {data.summary}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core Capabilities</h3>
                            <ul className="space-y-2">
                                {data.what_they_do.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-slate-600 italic">
                                        <span className="text-indigo-400 font-bold">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.keywords.map((kw, i) => (
                                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-medium text-[10px] uppercase tracking-wider">
                                        {kw}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Derived Signals</h3>
                            <div className="space-y-2">
                                {data.signals.map((sig, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-700 text-xs font-medium">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        {sig}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>

            {!loading && data && (
                <CardFooter className="bg-slate-50/80 border-t py-3 flex flex-col gap-2">
                    <div className="w-full">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Confidence Sources</h3>
                        <div className="space-y-1">
                            {data.sources.map((source, i) => (
                                <div key={i} className="flex items-center justify-between text-[10px]">
                                    <div className="flex items-center text-indigo-600 truncate max-w-[200px]">
                                        <Clock className="h-3 w-3 mr-1 text-slate-400" />
                                        {source.url.replace("https://", "")}
                                    </div>
                                    <span className="text-slate-400 italic">Extracted {source.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEnrich}
                        className="w-full text-[10px] h-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 mt-1"
                    >
                        Re-run Intelligence Pull
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
