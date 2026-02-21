"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

export function BackButton() {
    const [isNavigating, setIsNavigating] = useState(false);
    const router = useRouter();

    const handleBack = () => {
        setIsNavigating(true);
        router.push("/companies");
    };

    return (
        <button
            onClick={handleBack}
            disabled={isNavigating}
            className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all w-fit group cursor-pointer disabled:opacity-70"
        >
            {isNavigating ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin text-indigo-600" />
            ) : (
                <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
            )}
            {isNavigating ? "Engaging Archive..." : "Archive Selection"}
        </button>
    );
}
