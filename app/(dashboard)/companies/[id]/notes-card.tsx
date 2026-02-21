"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesCardProps {
    companyId: string;
}

export function NotesCard({ companyId }: NotesCardProps) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch(`/api/companies/${companyId}/notes`);
                if (res.ok) {
                    const data = await res.json();
                    setNotes(data.notes || "");
                }
            } catch (err) {
                console.error("Failed to fetch notes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [companyId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/companies/${companyId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
            });
            if (res.ok) {
                setJustSaved(true);
                localStorage.setItem(`notes-${companyId}`, notes);
                window.dispatchEvent(new StorageEvent("storage", {
                    key: `notes-${companyId}`,
                    newValue: notes,
                }));
                setTimeout(() => setJustSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save notes", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <Card className="rounded-[2rem] border-none shadow-xl bg-white/50 backdrop-blur-sm h-[300px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </Card>
        );
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden group transition-all hover:shadow-indigo-500/10 border border-slate-100 isolate will-change-transform">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-7 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600 group-hover:scale-110 transition-transform group-hover:rotate-3">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Institutional Memory</CardTitle>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Persistence Cluster Active</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "rounded-xl px-6 font-bold text-xs uppercase tracking-widest transition-all",
                            justSaved ? "bg-emerald-500 hover:bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"
                        )}
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : justSaved ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <Textarea
                    placeholder="Capture investment considerations, founder insights, or follow-up items..."
                    value={notes}
                    onChange={(e) => {
                        const val = e.target.value;
                        setNotes(val);
                        // Sync to localStorage immediately for export
                        localStorage.setItem(`notes-${companyId}`, val);
                        window.dispatchEvent(new StorageEvent("storage", {
                            key: `notes-${companyId}`,
                            newValue: val,
                        }));
                    }}
                    className="min-h-[200px] bg-slate-50/30 border-slate-100 rounded-3xl p-6 text-slate-700 font-medium leading-relaxed focus-visible:ring-indigo-600 focus-visible:bg-white transition-all resize-none"
                    onKeyDown={(e) => {
                        if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            handleSave();
                        }
                    }}
                />
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Press Ctrl+S to save instantly
                    </p>
                    {justSaved && (
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                            Intelligence Persisted Successfully
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
