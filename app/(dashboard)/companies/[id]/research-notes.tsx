"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    FileText,
    Save,
    Loader2,
    CheckCircle2,
    PenLine,
    Database,
    Binary
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ResearchNotesProps {
    companyId: string;
}

export function ResearchNotes({ companyId }: ResearchNotesProps) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    useEffect(() => {
        fetch(`/api/companies/${companyId}/notes`)
            .then(res => res.json())
            .then(data => {
                setNotes(data.notes || "");
                localStorage.setItem(`notes-${companyId}`, data.notes || "");
            })
            .finally(() => setLoading(false));
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
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <section className="space-y-6 pt-12 border-t border-slate-100">
            {loading ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-2 w-24" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                            <PenLine className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">Institutional Repository</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Knowledge Persistence</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {justSaved && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-in fade-in slide-in-from-right-4">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Neural Sync Complete</span>
                            </div>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-slate-900 hover:bg-black text-white h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all transform-gpu active:scale-95"
                        >
                            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Save Observations</>}
                        </Button>
                    </div>
                </div>
            )}

            <div className="relative group">
                {loading ? (
                    <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
                ) : (
                    <>
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <Textarea
                            placeholder="Document distinct observations, market signals, and investment rationale..."
                            value={notes}
                            onChange={(e) => {
                                const val = e.target.value;
                                setNotes(val);
                                localStorage.setItem(`notes-${companyId}`, val);
                                window.dispatchEvent(new StorageEvent("storage", {
                                    key: `notes-${companyId}`,
                                    newValue: val,
                                }));
                            }}
                            className="min-h-[300px] w-full bg-slate-50 border-slate-100 rounded-[2.5rem] p-10 text-slate-700 font-medium leading-relaxed italic text-lg focus-visible:ring-slate-200 focus-visible:bg-white transition-all resize-none shadow-sm relative z-10"
                            onKeyDown={(e) => {
                                if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault();
                                    handleSave();
                                }
                            }}
                        />
                        <div className="absolute bottom-6 right-10 z-20 flex items-center gap-4 opacity-40 group-focus-within:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2">
                                <Database className="h-3 w-3 text-slate-400" />
                                <span className="text-[8px] font-black uppercase tracking-tight text-slate-400">Sync Active</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
