"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, StickyNote, History, Sparkles } from "lucide-react";

interface CompanyNotesProps {
    companyId: string;
}

export function CompanyNotes({ companyId }: CompanyNotesProps) {
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    useEffect(() => {
        const savedNotes = localStorage.getItem(`notes-${companyId}`);
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, [companyId]);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem(`notes-${companyId}`, notes);

        setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date().toLocaleTimeString());
        }, 600);
    };

    return (
        <Card className="border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white group">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/10">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
                        <StickyNote className="h-4 w-4 text-indigo-500" />
                        Venture Notebook
                    </CardTitle>
                    {lastSaved && (
                        <div className="text-[10px] font-bold text-slate-300 flex items-center gap-1 uppercase tracking-wider">
                            <History className="h-3 w-3" />
                            Auto-Synced {lastSaved}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-indigo-500/50">
                        <span>Thesis Alignment Prompts</span>
                        <Badge variant="outline" className="border-indigo-100 text-indigo-400 text-[8px]">Expert Mode</Badge>
                    </div>
                    <ul className="grid grid-cols-1 gap-2">
                        {[
                            "How does this fit our AI-first thesis?",
                            "What are the primary moats observed?",
                            "Founder pedigree & technical velocity?"
                        ].map((prompt, i) => (
                            <li key={i} className="text-[10px] font-bold text-slate-400 flex items-center gap-2 bg-slate-50 p-2 rounded-lg italic">
                                <Sparkles className="h-3 w-3 text-indigo-300" />
                                {prompt}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative">
                    <Textarea
                        placeholder="Document your deep-dive analysis here..."
                        className="min-h-[220px] bg-white border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base leading-relaxed font-medium placeholder:text-slate-300 shadow-inner rounded-2xl p-6"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 pointer-events-none">
                        Rich Text Intelligence Active
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
                >
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                            Securing Analysis...
                        </div>
                    ) : (
                        <>
                            <Save className="mr-3 h-4 w-4 text-indigo-400" />
                            Commit Analysis
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
