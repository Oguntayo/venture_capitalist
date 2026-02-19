"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Building2, List, Bookmark, ChevronRight } from "lucide-react";
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

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (open && companies.length === 0) {
            fetch("/api/companies")
                .then(res => res.json())
                .then(data => setCompanies(data))
                .catch(err => console.error("Failed to fetch companies for search", err));
        }
    }, [open, companies.length]);

    const filteredCompanies = useMemo(() => {
        if (!query) return [];
        return companies
            .filter(c =>
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.industry.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5);
    }, [query, companies]);

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
                <span className="flex-1 text-left">Search companies...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-slate-200 shadow-2xl">
                    <DialogTitle className="sr-only">Search Companies</DialogTitle>
                    <DialogDescription className="sr-only">
                        Search for companies, industries, or investment stages.
                    </DialogDescription>
                    <div className="flex items-center border-b px-4 h-14 bg-white">
                        <Search className="h-5 w-5 text-slate-400 mr-3" />
                        <Input
                            autoFocus
                            placeholder="Search companies, lists, or navigation..."
                            className="border-none shadow-none focus-visible:ring-0 bg-transparent text-lg h-full px-0"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="text-[10px] font-medium border rounded px-1.5 py-0.5">ESC</span>
                        </div>
                    </div>

                    <div className="max-h-[450px] overflow-y-auto p-2 bg-white">
                        {query && filteredCompanies.length > 0 && (
                            <div className="mb-4">
                                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Companies</div>
                                {filteredCompanies.map((company) => (
                                    <div
                                        key={company.id}
                                        onClick={() => handleSelect(`/companies/${company.id}`)}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-50/50 cursor-pointer group transition-colors border border-transparent hover:border-indigo-100"
                                    >
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded border bg-white p-1 mr-3 shrink-0">
                                                <img src={company.logo_url} alt="" className="h-full w-full object-contain" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-700">{company.name}</div>
                                                <div className="text-xs text-slate-400">{company.industry} • {company.stage}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-all" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!query && (
                            <div className="mb-4">
                                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</div>
                                {[
                                    { name: "Discovery Engine", href: "/companies", icon: Search },
                                    { name: "My Curated Lists", href: "/lists", icon: List },
                                    { name: "Saved Workflows", href: "/saved", icon: Bookmark },
                                ].map((item) => (
                                    <div
                                        key={item.href}
                                        onClick={() => handleSelect(item.href)}
                                        className="flex items-center px-3 py-3 rounded-lg hover:bg-slate-100 cursor-pointer group transition-colors"
                                    >
                                        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {query && filteredCompanies.length === 0 && (
                            <div className="py-12 text-center">
                                <Building2 className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-400 italic">No companies found for &quot;{query}&quot;</p>
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
