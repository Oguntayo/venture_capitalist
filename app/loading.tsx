"use client";

import { Loader2, Activity } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-500">
            <div className="flex flex-col items-center gap-6 p-10 rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100/50 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-50" />

                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="h-8 w-8 text-indigo-600 animate-pulse" />
                    </div>
                </div>

                <div className="space-y-2 text-center">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                        Syncing Intelligence
                    </h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic animate-pulse">
                        Neural Cluster Engaging...
                    </p>
                </div>
            </div>
        </div>
    );
}
