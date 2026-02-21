"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SavedSearch {
    id: string;
    name: string;
    query: string;
    filters: {
        stages: string[];
        industries: string[];
    };
    isAi?: boolean;
}

export default function SavedSearchesPage() {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("vc-scout-saved-searches");
        if (saved) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSavedSearches(JSON.parse(saved));
        }
    }, []);

    const deleteSearch = (id: string) => {
        const updated = savedSearches.filter((s) => s.id !== id);
        setSavedSearches(updated);
        localStorage.setItem("vc-scout-saved-searches", JSON.stringify(updated));
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Saved Searches</h1>
                    <p className="text-slate-500 mt-1">
                        Re-run your favorite filters and discovery workflows.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedSearches.length > 0 ? (
                        savedSearches.map((search) => (
                            <Card key={search.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg font-bold text-slate-900">{search.name}</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                        onClick={() => deleteSearch(search.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {search.query && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Search className="h-3 w-3" />
                                                &quot;{search.query}&quot;
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-1">
                                            {search.filters.stages.map((s) => (
                                                <Badge key={s} variant="secondary" className="text-[10px] py-0">{s}</Badge>
                                            ))}
                                            {search.filters.industries.map((i) => (
                                                <Badge key={i} variant="outline" className="text-[10px] py-0">{i}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button asChild className="w-full bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 shadow-none mt-2">
                                        <Link href={`/companies?q=${encodeURIComponent(search.query)}&stages=${search.filters.stages.join(",")}&industries=${search.filters.industries.join(",")}${search.isAi ? "&ai=true" : ""}`}>
                                            Run Search
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">No saved searches</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-1">
                                Save your filters on the companies page to quickly re-run them later.
                            </p>
                            <Button asChild className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                                <Link href="/companies">Discover Companies</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
