"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, StickyNote, History } from "lucide-react";

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
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <StickyNote className="h-5 w-5 text-indigo-500" />
                        Venture Notes
                    </CardTitle>
                    {lastSaved && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <History className="h-3 w-3" />
                            Saved at {lastSaved}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <Textarea
                    placeholder="Add internal notes about this company, investment thesis, or founder calls..."
                    className="min-h-[150px] bg-slate-50/30 border-slate-200 focus:bg-white transition-all text-sm leading-relaxed"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-slate-900 border-none hover:bg-slate-800 transition-all font-semibold"
                >
                    {isSaving ? "Saving..." : "Save Thesis Notes"}
                    <Save className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}
