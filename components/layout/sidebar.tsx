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
    BarChart3,
    Sparkles,
    ChevronDown,
    ChevronRight,
    Briefcase
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mainItems = [
    { name: "Companies", href: "/companies", icon: Search },
    { name: "My Lists", href: "/lists", icon: List },
    { name: "Saved Searches", href: "/saved", icon: Bookmark },
];

const analyticItems = [
    { name: "Performance", href: "/performance", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(true);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);

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
                        className="flex items-center justify-between w-full px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        Discovery
                        {isDiscoveryOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {isDiscoveryOpen && (
                        <div className="space-y-1">
                            {mainItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group",
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        )}
                                    >
                                        <item.icon className={cn("mr-3 h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                        {item.name}
                                    </Link>
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
                    <Link
                        href="/thesis"
                        className={cn(
                            "flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group",
                            pathname === "/thesis"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                        )}
                    >
                        <Sparkles className={cn("mr-3 h-5 w-5 transition-colors", pathname === "/thesis" ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                        My Thesis
                    </Link>
                </div>

                {/* Analytics Section */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                        className="flex items-center justify-between w-full px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        Analytics
                        {isAnalyticsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {isAnalyticsOpen && (
                        <div className="space-y-1">
                            {analyticItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group",
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                        )}
                                    >
                                        <item.icon className={cn("mr-3 h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
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
