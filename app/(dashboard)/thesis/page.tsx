"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Sparkles,
    Loader2,
    CheckCircle2,
    Lightbulb,
    Info,
    Target,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ThesisPage() {
    const [thesis, setThesis] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchThesis = async () => {
            try {
                const res = await fetch("/api/user/thesis");
                const data = await res.json();
                setThesis(data.thesis || "");
            } catch (e) {
                console.error("Failed to fetch thesis", e);
            }
        };
        fetchThesis();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/user/thesis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thesis }),
            });

            if (response.ok) {
                setLastSaved(new Date());
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to save thesis:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-indigo-600" />
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight uppercase italic">Investment Thesis</h1>
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed italic">Define your strategy to unlock personalized AI matching and discovery.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {lastSaved && (
                            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                Last saved: {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-11 shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : showSuccess ? <CheckCircle2 className="h-4 w-4" /> : null}
                            {showSuccess ? "Saved Successfully" : isSaving ? "Saving..." : "Deploy Thesis"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white/70 backdrop-blur-xl border border-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold text-slate-900">Thesis Editor</CardTitle>
                                <CardDescription>Craft your high-fidelity investment lens here.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <Textarea
                                    value={thesis}
                                    onChange={(e) => setThesis(e.target.value)}
                                    placeholder="We invest in..."
                                    className="min-h-[300px] md:min-h-[400px] text-base md:text-lg font-medium border-slate-100 focus:ring-2 focus:ring-indigo-500 rounded-2xl md:rounded-3xl p-6 md:p-8 bg-slate-50/30 resize-none transition-all shadow-inner"
                                />
                                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 gap-2">
                                    <span>Character count: {thesis.length}</span>
                                    <span className="flex items-center gap-1.5 text-indigo-500">
                                        <Sparkles className="h-3 w-3" />
                                        AI Match Engine Active
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-none shadow-xl rounded-[2rem] bg-indigo-600 text-white p-2">
                            <CardHeader className="pb-2 text-center">
                                <div className="mx-auto bg-white/20 p-3 rounded-2xl w-fit mb-4">
                                    <Lightbulb className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold">Best Practices</CardTitle>
                                <CardDescription className="text-indigo-100">Maximize AI Precision</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 md:space-y-4 pt-4 px-4 md:px-6">
                                <div className="flex gap-2 bg-white/10 p-4 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group">
                                    <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-[10px] md:text-xs">1</div>
                                    <p className="text-[11px] md:text-sm font-medium leading-relaxed">Be specific about **stages** (e.g., Pre-seed to Series A only).</p>
                                </div>
                                <div className="flex gap-2 bg-white/10 p-4 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group">
                                    <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-[10px] md:text-xs">2</div>
                                    <p className="text-[11px] md:text-sm font-medium leading-relaxed">Mention mandatory **tech stacks** or **business models** (e.g. SaaS).</p>
                                </div>
                                <div className="flex gap-2 bg-white/10 p-4 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group">
                                    <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-[10px] md:text-xs">3</div>
                                    <p className="text-[11px] md:text-sm font-medium leading-relaxed">Highlight **unfavorable traits** to exclude non-matches.</p>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
