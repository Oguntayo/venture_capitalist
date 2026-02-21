"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    List,
    Search,
    Bookmark,
    LogOut,
    Activity,
    Sparkles,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const mainItems = [
    { name: "Companies", href: "/companies", icon: Search },
    { name: "My Lists", href: "/lists", icon: List },
    { name: "Saved Searches", href: "/saved", icon: Bookmark },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(true);
    const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

    // Reset navigating state when pathname changes (navigation finished)
    useEffect(() => {
        setNavigatingHref(null);
    }, [pathname]);

    const handleNavigate = (href: string) => {
        if (pathname === href) return;
        setNavigatingHref(href);
        router.push(href);
    };

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white shadow-xl shadow-slate-200/50 z-20">
            <div className="flex h-16 items-center px-6 border-b bg-slate-50/30">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">VC Scout</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-6 px-4 space-y-6">
                {/* Discovery Section */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsDiscoveryOpen(!isDiscoveryOpen)}
                        className="flex items-center justify-between w-full px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        Discovery
                        {isDiscoveryOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {isDiscoveryOpen && (
                        <div className="space-y-1">
                            {mainItems.map((item) => {
                                const isActive = pathname === item.href;
                                const isNavigating = navigatingHref === item.href;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => handleNavigate(item.href)}
                                        disabled={navigatingHref !== null}
                                        className={cn(
                                            "flex items-center w-full px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group text-left cursor-pointer",
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600",
                                            navigatingHref !== null && !isNavigating && "opacity-50 grayscale-[0.5]"
                                        )}
                                    >
                                        <div className="relative mr-3 h-5 w-5 flex items-center justify-center">
                                            {isNavigating ? (
                                                <Loader2 className={cn("h-4 w-4 animate-spin", isActive ? "text-white" : "text-indigo-600")} />
                                            ) : (
                                                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                            )}
                                        </div>
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Strategy Section */}
                <div className="space-y-1">
                    <div className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Strategy
                    </div>
                    <button
                        onClick={() => handleNavigate("/thesis")}
                        disabled={navigatingHref !== null}
                        className={cn(
                            "flex items-center w-full px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group text-left cursor-pointer",
                            pathname === "/thesis"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600",
                            navigatingHref !== null && navigatingHref !== "/thesis" && "opacity-50 grayscale-[0.5]"
                        )}
                    >
                        <div className="relative mr-3 h-5 w-5 flex items-center justify-center">
                            {navigatingHref === "/thesis" ? (
                                <Loader2 className={cn("h-4 w-4 animate-spin", pathname === "/thesis" ? "text-white" : "text-indigo-600")} />
                            ) : (
                                <Sparkles className={cn("h-5 w-5 transition-colors", pathname === "/thesis" ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                            )}
                        </div>
                        My Thesis
                    </button>
                </div>
            </div>

            <div className="p-4 border-t bg-slate-50/50">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-600 font-semibold rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
