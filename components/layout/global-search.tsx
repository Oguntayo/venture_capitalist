"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Building2, List, Bookmark, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Company } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [aiSearch, setAiSearch] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [lists, setLists] = useState<{ id: string; name: string }[]>([]);
    const [savedSearches, setSavedSearches] = useState<{ id: string; name: string }[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const router = useRouter();

    const filteredCompanies = useMemo(() => {
        if (!query) return [];


        const nameMatches = companies.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase())
        );

        if (!aiSearch) return nameMatches.slice(0, 5).map(c => ({ ...c, searchMode: 'exact' as const }));


        const intentMatches = companies.filter(c => {
            const searchLower = query.toLowerCase();
            const keywords = searchLower.split(/[\s,.]+/).filter(word => word.length >= 2 && !["related", "companies"].includes(word));
            const companyText = `${c.name} ${c.industry} ${c.description || ""} ${c.tags?.join(" ") || ""}`.toLowerCase();

            return keywords.some(word => companyText.includes(word));
        });


        const combined = [...nameMatches];
        intentMatches.forEach(c => {
            if (!combined.find(rc => rc.id === c.id)) combined.push(c);
        });

        return combined.slice(0, 5).map(c => ({
            ...c,
            searchMode: nameMatches.find(nc => nc.id === c.id) ? 'exact' : 'intent'
        }));
    }, [query, companies, aiSearch]);

    const filteredLists = useMemo(() => {
        if (!query) return [];
        return lists
            .filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 3);
    }, [query, lists]);

    const filteredWorkflows = useMemo(() => {
        if (!query) return [];
        return savedSearches
            .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 3);
    }, [query, savedSearches]);

    const allResults = useMemo(() => {
        if (!query) return [];
        return [
            ...filteredCompanies.map(c => ({ type: 'company', href: `/companies/${c.id}` })),
            ...filteredLists.map(l => ({ type: 'list', href: `/lists` })),
            ...filteredWorkflows.map(s => ({ type: 'workflow', href: `/saved` }))
        ];
    }, [query, filteredCompanies, filteredLists, filteredWorkflows]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }

            if (open) {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((i) => (allResults.length > 0 ? (i + 1) % allResults.length : 0));
                }
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((i) => (allResults.length > 0 ? (i - 1 + allResults.length) % allResults.length : 0));
                }
                if (e.key === "Enter" && allResults[selectedIndex]) {
                    e.preventDefault();
                    handleSelect(allResults[selectedIndex].href);
                }
                if (e.key === "Escape") {
                    setOpen(false);
                }
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, allResults, selectedIndex]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await fetch("/api/companies");
                const data = await res.json();
                setCompanies(data);
            } catch (err) {
                console.error("Failed to pre-fetch companies for search", err);
            }

            try {
                const resLists = await fetch("/api/lists");
                if (resLists.ok) {
                    const listsData = await resLists.json();
                    setLists(listsData);
                }
            } catch (err) {
                console.error("Failed to fetch lists for search", err);
            }

            const savedWorkflows = localStorage.getItem("vc-scout-saved-searches");
            if (savedWorkflows) setSavedSearches(JSON.parse(savedWorkflows));
        };
        fetchData();
    }, []);

    const handleAiSearchToggle = (checked: boolean) => {
        setAiSearch(checked);
        if (checked && query) {
            setIsAiLoading(true);
            setTimeout(() => setIsAiLoading(false), 800);
        }
    };

    const handleSelect = (href: string) => {
        setOpen(false);
        setQuery("");
        router.push(href);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex h-10 w-full max-w-sm items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 hover:border-indigo-300 hover:bg-slate-50 transition-all shadow-sm group"
            >
                <Search className="h-4 w-4 group-hover:text-indigo-500" />
                <span className="flex-1 text-left">Search everything...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-slate-200 shadow-2xl rounded-2xl">
                    <DialogTitle className="sr-only">Search Everything</DialogTitle>
                    <DialogDescription className="sr-only">
                        Search for companies, lists, or saved discovery workflows.
                    </DialogDescription>
                    <div className="relative group/search">
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 opacity-0 transition-opacity duration-1000",
                            aiSearch && query && "opacity-100"
                        )}></div>
                        <div className="flex items-center border-b px-6 h-20 bg-white/80 backdrop-blur-md relative z-10">
                            <Search className={cn(
                                "h-6 w-6 mr-4 transition-colors duration-500",
                                aiSearch && query ? "text-indigo-600" : "text-slate-400"
                            )} />
                            <Input
                                autoFocus
                                placeholder={aiSearch ? "Describe your investment thesis..." : "Search companies, lists..."}
                                className="border-none shadow-none focus-visible:ring-0 bg-transparent text-xl font-medium h-full px-0 flex-1 placeholder:text-slate-300 transition-all"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="flex items-center gap-6 border-l pl-6 h-10 border-slate-100">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="flex items-center gap-3">
                                        <Label
                                            htmlFor="ai-search-toggle"
                                            className={cn(
                                                "text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-pointer",
                                                aiSearch ? "text-indigo-600" : "text-slate-400"
                                            )}
                                        >
                                            AI Intelligence
                                        </Label>
                                        <div className="relative">
                                            {aiSearch && (
                                                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-40 animate-pulse"></div>
                                            )}
                                            <Switch
                                                id="ai-search-toggle"
                                                checked={aiSearch}
                                                onCheckedChange={handleAiSearchToggle}
                                                className="relative data-[state=checked]:bg-indigo-600 border-none h-6 w-11 shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {aiSearch && query && (
                            <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 animate-shimmer bg-[length:200%_100%] absolute bottom-0 left-0 right-0 z-20"></div>
                        )}
                    </div>

                    <div className="max-h-[500px] overflow-y-auto px-4 py-4 bg-white/50 backdrop-blur-xl">
                        {isAiLoading ? (
                            <div className="py-20 text-center flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-sm font-black text-indigo-600 uppercase tracking-widest animate-pulse">Neural Indexing...</p>
                            </div>
                        ) : query && (allResults.length > 0) ? (
                            <div className="space-y-6">
                                {filteredCompanies.length > 0 && (
                                    <div>
                                        <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Institutional Entities</div>
                                        <div className="space-y-1.5">
                                            {filteredCompanies.map((company, idx) => {
                                                const isSelected = selectedIndex === idx;
                                                return (
                                                    <div
                                                        key={company.id}
                                                        onClick={() => handleSelect(`/companies/${company.id}`)}
                                                        onMouseMove={() => setSelectedIndex(idx)}
                                                        className={cn(
                                                            "flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer group transition-all duration-300 border border-transparent",
                                                            isSelected ? "bg-white shadow-xl shadow-indigo-500/10 border-indigo-100 -translate-y-[2px]" : "hover:bg-white/60 hover:border-slate-100"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-xl border border-slate-100 bg-white p-2 shadow-sm shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                                                                <img src={company.logo_url} alt="" className="h-full w-full object-contain" />
                                                            </div>
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-base font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{company.name}</div>
                                                                    {company.searchMode === 'intent' && (
                                                                        <Badge className="h-4 px-1.5 text-[8px] font-black bg-indigo-50 text-indigo-700 border-indigo-100 uppercase tracking-widest">Nexus Match</Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 font-bold text-[10px] text-slate-400 uppercase tracking-tighter">
                                                                    <span>{company.industry}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                                    <span>{company.stage}</span>
                                                                    {company.searchMode === 'intent' && (
                                                                        <>
                                                                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                                            <span className="text-indigo-500/80 italic normal-case tracking-normal">Matched Description/Tags</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{company.signal_score} %</span>
                                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Signal</span>
                                                            </div>
                                                            <ChevronRight className={cn("h-5 w-5 transition-all", isSelected ? "text-indigo-500 translate-x-1" : "text-slate-200")} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {filteredLists.length > 0 && (
                                    <div>
                                        <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Curated Intelligence</div>
                                        <div className="space-y-1.5">
                                            {filteredLists.map((list, idx) => {
                                                const globalIdx = filteredCompanies.length + idx;
                                                const isSelected = selectedIndex === globalIdx;
                                                return (
                                                    <div
                                                        key={list.id}
                                                        onClick={() => handleSelect(`/lists`)}
                                                        onMouseMove={() => setSelectedIndex(globalIdx)}
                                                        className={cn(
                                                            "flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer group transition-all duration-300 border border-transparent font-bold",
                                                            isSelected ? "bg-amber-50/50 shadow-xl shadow-amber-500/5 border-amber-100 -translate-y-[2px]" : "hover:bg-amber-50/30 hover:border-amber-100"
                                                        )}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={cn(
                                                                "h-10 w-10 rounded-xl flex items-center justify-center mr-4 shrink-0 transition-colors shadow-sm",
                                                                isSelected ? "bg-amber-100 text-amber-600" : "bg-amber-50 text-amber-500"
                                                            )}>
                                                                <List className="h-5 w-5" />
                                                            </div>
                                                            <div className="text-sm font-black text-slate-800 tracking-tight uppercase">{list.name}</div>
                                                        </div>
                                                        <ChevronRight className={cn("h-5 w-5 transition-all text-amber-600", isSelected ? "translate-x-1" : "opacity-30")} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {filteredWorkflows.length > 0 && (
                                    <div>
                                        <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Automated Discovery</div>
                                        <div className="space-y-1.5">
                                            {filteredWorkflows.map((search, idx) => {
                                                const globalIdx = filteredCompanies.length + filteredLists.length + idx;
                                                const isSelected = selectedIndex === globalIdx;
                                                return (
                                                    <div
                                                        key={search.id}
                                                        onClick={() => handleSelect(`/saved`)}
                                                        onMouseMove={() => setSelectedIndex(globalIdx)}
                                                        className={cn(
                                                            "flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer group transition-all duration-300 border border-transparent font-bold",
                                                            isSelected ? "bg-emerald-50/50 shadow-xl shadow-emerald-500/5 border-emerald-100 -translate-y-[2px]" : "hover:bg-emerald-50/30 hover:border-emerald-100"
                                                        )}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={cn(
                                                                "h-10 w-10 rounded-xl flex items-center justify-center mr-4 shrink-0 transition-colors shadow-sm",
                                                                isSelected ? "bg-emerald-100 text-emerald-600" : "bg-emerald-50 text-emerald-500"
                                                            )}>
                                                                <Bookmark className="h-5 w-5" />
                                                            </div>
                                                            <div className="text-sm font-black text-slate-800 tracking-tight uppercase">{search.name}</div>
                                                        </div>
                                                        <ChevronRight className={cn("h-5 w-5 transition-all text-emerald-600", isSelected ? "translate-x-1" : "opacity-30")} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : query ? (
                            <div className="py-20 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                    <Building2 className="h-10 w-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-400 tracking-tight italic">Zero Entities Found</h3>
                                <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">Try adjusting your AI Intelligence query or search parameters.</p>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Navigation</div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { name: "Discovery Engine", href: "/companies", icon: Search, color: "indigo" },
                                        { name: "Curated Hubs", href: "/lists", icon: List, color: "amber" },
                                        { name: "Global Thesis", href: "/thesis", icon: Bookmark, color: "violet" },
                                        { name: "Performance", href: "/performance", icon: Building2, color: "emerald" },
                                    ].map((item) => (
                                        <div
                                            key={item.href}
                                            onClick={() => handleSelect(item.href)}
                                            className="group flex flex-col gap-4 p-6 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer transition-all duration-300"
                                        >
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                                                item.color === "indigo" ? "bg-indigo-50 text-indigo-600" :
                                                    item.color === "amber" ? "bg-amber-50 text-amber-600" :
                                                        item.color === "violet" ? "bg-violet-50 text-violet-600" :
                                                            "bg-emerald-50 text-emerald-600"
                                            )}>
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-600 uppercase">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 border-t p-3 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1.5">
                                <kbd className="border bg-white px-1 rounded">↵</kbd> select
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="border bg-white px-1 rounded">↑↓</kbd> navigate
                            </span>
                        </div>
                        <div className="text-indigo-500">VC Scout Pro</div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
