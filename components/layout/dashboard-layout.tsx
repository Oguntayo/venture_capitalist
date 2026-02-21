"use client";

import { Sidebar } from "./sidebar";
import { GlobalSearch } from "./global-search";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Bell, Settings, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThesisModal } from "@/components/thesis/thesis-modal";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);
    const [thesis, setThesis] = useState<string | undefined>(undefined);
    const [hasCheckedThesis, setHasCheckedThesis] = useState(false);
    const [isBannerVisible, setIsBannerVisible] = useState(false);
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchThesis = async () => {
            if (status === "authenticated" && !hasCheckedThesis) {
                try {
                    const response = await fetch("/api/user/thesis");
                    const data = await response.json();
                    setThesis(data.thesis || "");

                    if (!data.thesis) {
                        const dismissed = sessionStorage.getItem("vc-thesis-banner-dismissed");
                        if (!dismissed) {
                            setIsBannerVisible(true);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch thesis:", error);
                } finally {
                    setHasCheckedThesis(true);
                }
            }
        };

        fetchThesis();
    }, [status, hasCheckedThesis]);

    const handleSaveThesis = (newThesis: string) => {
        setThesis(newThesis);
        setIsThesisModalOpen(false);
        setIsBannerVisible(false);
    };




    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {isBannerVisible && !thesis && (
                    <div className="bg-indigo-600 text-white px-8 py-2.5 flex items-center justify-between text-sm font-medium animate-in slide-in-from-top duration-300 shadow-lg relative z-50">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-indigo-200" />
                            <span>Add your Investment Thesis to unlock personalized AI Match Scores for all companies.</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsThesisModalOpen(true)}
                                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
                            >
                                Setup Now
                            </button>
                            <button
                                onClick={() => {
                                    setIsBannerVisible(false);
                                    sessionStorage.setItem("vc-thesis-banner-dismissed", "true");
                                }}
                                className="text-white/60 hover:text-white"
                                title="Dismiss"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
                <header className="h-16 border-b bg-white px-8 flex items-center justify-between shrink-0">
                    <div className="w-full max-w-md">
                        <GlobalSearch />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-slate-400">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white shadow-sm">
                            {session.user?.email?.[0].toUpperCase()}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto px-8 py-8 h-full bg-slate-50/50 isolate will-change-scroll transform-gpu antialiased">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
            <ThesisModal
                isOpen={isThesisModalOpen}
                onClose={() => setIsThesisModalOpen(false)}
                currentThesis={thesis}
                onSave={handleSaveThesis}
            />
        </div>
    );
}
