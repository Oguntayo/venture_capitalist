"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface ThesisModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentThesis?: string;
    onSave: (newThesis: string) => void;
}

export function ThesisModal({ isOpen, onClose, currentThesis = "", onSave }: ThesisModalProps) {
    const [thesis, setThesis] = useState(currentThesis);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setThesis(currentThesis);
    }, [currentThesis, isOpen]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/user/thesis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thesis }),
            });

            if (response.ok) {
                onSave(thesis);
                onClose();
            }
        } catch (error) {
            console.error("Failed to save thesis:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px] border-none shadow-2xl bg-white/95 backdrop-blur-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Sparkles className="h-5 w-5 text-indigo-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                            Your Investment Thesis
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-500 leading-relaxed">
                        Define your fund's focus. This acts as a "lens" for our AI to score companies and provide custom insights.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                    <Textarea
                        placeholder="e.g., We invest in early-stage B2B SaaS companies focusing on workflow automation and AI-driven productivity tools in the North American market..."
                        className="min-h-[220px] text-base border-slate-200 focus:ring-indigo-500 rounded-xl resize-none p-4 shadow-sm"
                        value={thesis}
                        onChange={(e) => setThesis(e.target.value)}
                    />
                    <p className="mt-3 text-xs text-slate-400 italic">
                        Tip: Being specific about stages, sectors, and unique value-add helps the Match Score precision.
                    </p>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 text-slate-500 hover:text-slate-900">
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Thesis"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
