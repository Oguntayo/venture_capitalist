"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Company } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Bookmark,
    Plus,
    Sparkles,
    Zap,
    Trophy,
    Info,
    Download,
    Loader2
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { exportCompaniesToExcel } from "@/lib/export";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AddToListDropdown } from "@/components/lists/add-to-list-dropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CompaniesClientProps {
    initialCompanies: Company[];
}

const STAGES = ["Pre-seed", "Seed", "Series A", "Series B", "Growth"];
const INDUSTRIES = ["AI/ML", "Fintech", "SaaS", "Healthtech", "DevTools", "ClimateTech", "E-commerce", "Cybersecurity", "Web3"];

export function CompaniesClient({ initialCompanies }: CompaniesClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [selectedStages, setSelectedStages] = useState<string[]>(
        searchParams.get("stages")?.split(",").filter(Boolean) || []
    );
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
        searchParams.get("industries")?.split(",").filter(Boolean) || []
    );
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>({ key: "match_score", direction: "desc" });
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    const [minSignal, setMinSignal] = useState<number>(0);
    const [minHeadcount, setMinHeadcount] = useState<number>(0);
    const [aiSearch, setAiSearch] = useState(searchParams.get("ai") === "true");
    const [committedSearch, setCommittedSearch] = useState(searchParams.get("q") || "");

    const [saveName, setSaveName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isAiSearching, setIsAiSearching] = useState(false);

    // Per-company enriched scores — only populated after explicit enrichment
    const [enrichedScores, setEnrichedScores] = useState<Record<string, number>>({});
    const [pagingDirection, setPagingDirection] = useState<"prev" | "next" | "reset" | null>(null);

    // Load enriched scores from localStorage on mount
    useEffect(() => {
        const scores: Record<string, number> = {};
        initialCompanies.forEach(c => {
            const cached = localStorage.getItem(`enrichment-${c.id}`);
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    if (typeof data.match_score === "number") {
                        scores[c.id] = data.match_score;
                    }
                } catch { }
            }
        });
        setEnrichedScores(scores);
    }, [initialCompanies]);

    // Listen for new enrichments from company detail pages
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key?.startsWith("enrichment-") && e.newValue) {
                try {
                    const companyId = e.key.replace("enrichment-", "");
                    const data = JSON.parse(e.newValue);
                    if (typeof data.match_score === "number") {
                        setEnrichedScores(prev => ({ ...prev, [companyId]: data.match_score }));
                    }
                } catch { }
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const updateUrl = useCallback((q: string, stages: string[], industries: string[], ai: boolean) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (stages.length) params.set("stages", stages.join(","));
        if (industries.length) params.set("industries", industries.join(","));
        if (ai) params.set("ai", "true");

        const queryString = params.toString();
        router.replace(`/companies${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }, [router]);

    // URL sync for filters and standard search (AI search requires Enter)
    useEffect(() => {
        if (aiSearch) return; // Dedicated Enter handler for AI mode

        const timer = setTimeout(() => {
            updateUrl(search, selectedStages, selectedIndustries, aiSearch);
        }, 800);
        return () => clearTimeout(timer);
    }, [search, aiSearch, selectedStages, selectedIndustries, updateUrl]);

    const saveSearch = () => {
        if (!saveName) return;
        const newSearch = {
            id: Math.random().toString(36).substr(2, 9),
            name: saveName,
            query: search,
            filters: {
                stages: selectedStages,
                industries: selectedIndustries,
            },
            isAi: aiSearch
        };
        const existing = JSON.parse(localStorage.getItem("vc-scout-saved-searches") || "[]");
        localStorage.setItem("vc-scout-saved-searches", JSON.stringify([...existing, newSearch]));
        setSaveName("");
        setIsSaving(false);
    };

    const filteredCompanies = useMemo(() => {
        return initialCompanies.map(c => ({
            ...c,
            match_score: enrichedScores[c.id] ?? null,
        }))
            .filter((c) => {
                let matchesSearch = true;
                const activeSearch = aiSearch ? committedSearch : search;
                if (activeSearch) {
                    const searchLower = activeSearch.toLowerCase();
                    if (aiSearch) {
                        const keywords = searchLower.split(/[\s,.]+/).filter(word => word.length >= 2 && !["related", "companies", "startup", "firm"].includes(word));
                        const companyText = `${c.name} ${c.industry} ${c.description || ""} ${c.tags?.join(" ") || ""}`.toLowerCase();

                        matchesSearch = keywords.length > 0 ? keywords.some(word => companyText.includes(word)) : true;
                    } else {
                        matchesSearch = c.name.toLowerCase().includes(searchLower);
                    }
                }

                const matchesStage = selectedStages.length === 0 || selectedStages.includes(c.stage);
                const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(c.industry);
                const matchesSignal = c.signal_score >= minSignal;
                const matchesHeadcount = (c.headcount || 0) >= minHeadcount;

                return matchesSearch && matchesStage && matchesIndustry && matchesSignal && matchesHeadcount;
            })
            .sort((a, b) => {
                // ...
                if (!sortConfig) return 0;
                const { key, direction } = sortConfig;
                const valA = (a as any)[key];
                const valB = (b as any)[key];
                if (valA < valB) return direction === "asc" ? -1 : 1;
                if (valA > valB) return direction === "asc" ? 1 : -1;
                return 0;
            });
    }, [initialCompanies, enrichedScores, search, committedSearch, aiSearch, selectedStages, selectedIndustries, sortConfig]);

    const paginatedCompanies = filteredCompanies.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const [navigatingId, setNavigatingId] = useState<string | null>(null);

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && aiSearch) {
            if (!search) {
                // Empty box + Enter in AI mode → reset to full results
                setCommittedSearch("");
                updateUrl("", selectedStages, selectedIndustries);
            } else {
                setIsAiSearching(true);
                setCommittedSearch(""); // Clear results during loading
                setTimeout(() => {
                    setIsAiSearching(false);
                    setCommittedSearch(search);
                    updateUrl(search, selectedStages, selectedIndustries, true);
                }, 1200);
            }
        } else if (e.key === "Enter") {
            updateUrl(search, selectedStages, selectedIndustries, aiSearch);
        }
    };

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                return { key, direction: current.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "desc" };
        });
    };

    const toggleIndustry = (industry: string) => {
        setSelectedIndustries((prev) =>
            prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
        );
        handlePageChange(1, "reset");
    };

    const handlePageChange = (newPage: number, direction: "prev" | "next" | "reset") => {
        setPagingDirection(direction);
        setTimeout(() => {
            setPage(newPage);
            setPagingDirection(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
    };

    return (
        <TooltipProvider>
            <div className="space-y-6 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Discovery</h1>
                            <Badge className="bg-indigo-100 text-indigo-700 border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">PRO</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Institutional-grade market intelligence and thesis matching.</p>
                    </div>

                    <Dialog open={isSaving} onOpenChange={setIsSaving}>
                        <DialogTrigger asChild>
                            <Button className="bg-white border text-slate-600 hover:bg-slate-50 rounded-xl h-10 px-4 shadow-sm flex items-center gap-2 transition-all active:scale-95 group">
                                <Bookmark className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-sm font-bold">Save Workflow</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-sm">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-slate-900">Save Workflow</DialogTitle>
                                <DialogDescription className="text-slate-500 pt-2">
                                    Pin this search configuration to your dashboard for real-time tracking.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-6">
                                <Input
                                    placeholder="e.g. Early Stage Fintech"
                                    value={saveName}
                                    onChange={(e) => setSaveName(e.target.value)}
                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-indigo-600"
                                    onKeyDown={(e) => e.key === "Enter" && saveSearch()}
                                />
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-3">
                                <Button variant="ghost" onClick={() => setIsSaving(false)} className="rounded-xl flex-1 text-slate-500 hover:bg-slate-50">Cancel</Button>
                                <Button onClick={saveSearch} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex-1 px-8">Save search</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>

                {/* Discovery Toolbar */}
                <div className="relative group/toolbar">
                    <div className={cn(
                        "absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-0 transition-opacity duration-1000",
                        aiSearch && search && "opacity-100"
                    )}></div>
                    <div className="relative bg-white/80 backdrop-blur-md border border-white p-3 rounded-[2rem] shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row gap-3 z-10">
                        {/* Search & AI Toggle Group */}
                        <div className="flex-1 flex items-center gap-4 bg-white/50 rounded-2xl border border-slate-100 px-4 py-2 shadow-inner focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all group/input">
                            <Search className={cn(
                                "h-5 w-5 transition-colors duration-500",
                                aiSearch && search ? "text-indigo-600" : "text-slate-400"
                            )} />
                            <Input
                                placeholder={aiSearch ? "Describe your thesis (e.g. 'Vertical SaaS with high capital efficiency')..." : "Search by company name..."}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 font-semibold h-12"
                            />
                            <div className="flex items-center gap-6 border-l pl-6 pr-2 h-8 my-auto border-slate-100">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-3">
                                        <Label
                                            htmlFor="ai-toggle-discovery"
                                            className={cn(
                                                "text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer",
                                                aiSearch ? "text-indigo-600" : "text-slate-400"
                                            )}
                                        >
                                            AI Intelligence
                                        </Label>
                                        <div className="relative">
                                            {aiSearch && (
                                                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-30 animate-pulse"></div>
                                            )}
                                            <Switch
                                                id="ai-toggle-discovery"
                                                checked={aiSearch}
                                                onCheckedChange={setAiSearch}
                                                className="relative scale-90 data-[state=checked]:bg-indigo-600 border-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter Group */}
                        <div className="flex items-center gap-2">
                            {/* Market Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-12 px-5 hover:bg-white rounded-2xl flex flex-col items-start gap-0.5 group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] group-hover:text-indigo-400 transition-colors">Market</span>
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                            <span className="text-sm font-bold">
                                                {selectedIndustries.length > 0 || selectedStages.length > 0
                                                    ? `${selectedIndustries.length + selectedStages.length} Selected`
                                                    : "All Markets"}
                                            </span>
                                            <Filter className="h-3 w-3 opacity-30" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-3 rounded-2xl shadow-2xl border-slate-100">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Industry</Label>
                                            <div className="mt-2 space-y-0.5">
                                                {INDUSTRIES.map(i => (
                                                    <DropdownMenuCheckboxItem
                                                        key={i}
                                                        checked={selectedIndustries.includes(i)}
                                                        onCheckedChange={() => toggleIndustry(i)}
                                                        className="rounded-lg text-xs"
                                                    >
                                                        {i}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-slate-50">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Growth Stage</Label>
                                            <div className="mt-2 space-y-0.5">
                                                {STAGES.map(s => (
                                                    <DropdownMenuCheckboxItem
                                                        key={s}
                                                        checked={selectedStages.includes(s)}
                                                        onCheckedChange={() => toggleStage(s)}
                                                        className="rounded-lg text-xs"
                                                    >
                                                        {s}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="w-px h-8 bg-slate-200" />

                            {/* Momentum Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-12 px-5 hover:bg-white rounded-2xl flex flex-col items-start gap-0.5 group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] group-hover:text-amber-400 transition-colors">Momentum</span>
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                            <span className="text-sm font-bold">{minSignal > 0 ? `${minSignal}+ Score` : "Any"}</span>
                                            <Zap className="h-3 w-3 opacity-30" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-4 rounded-2xl shadow-2xl border-slate-100">
                                    <DropdownMenuLabel className="px-0 pt-0 pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                        Min. Momentum
                                        <span className="text-amber-600 font-black">{minSignal}</span>
                                    </DropdownMenuLabel>
                                    <div className="space-y-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="99"
                                            step="5"
                                            value={minSignal}
                                            onChange={(e) => {
                                                setMinSignal(parseInt(e.target.value));
                                                setPage(1);
                                            }}
                                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <span>Any</span>
                                            <span>Institutional Grade (80+)</span>
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="w-px h-8 bg-slate-200" />

                            {/* Scale Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-12 px-5 hover:bg-white rounded-2xl flex flex-col items-start gap-0.5 group">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] group-hover:text-indigo-400 transition-colors">Scale</span>
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                            <span className="text-sm font-bold">{minHeadcount > 0 ? `${minHeadcount.toLocaleString()}+ HC` : "Any Size"}</span>
                                            <Trophy className="h-3 w-3 opacity-30" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-4 rounded-2xl shadow-2xl border-slate-100">
                                    <DropdownMenuLabel className="px-0 pt-0 pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Select Min. Headcount</DropdownMenuLabel>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[0, 10, 50, 100, 500, 1000].map((val) => (
                                            <Button
                                                key={val}
                                                variant={minHeadcount === val ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => {
                                                    setMinHeadcount(val);
                                                    setPage(1);
                                                }}
                                                className={cn(
                                                    "h-10 text-[10px] font-black rounded-xl transition-all",
                                                    minHeadcount === val ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "hover:border-indigo-200 text-slate-500"
                                                )}
                                            >
                                                {val === 0 ? "Reset" : `${val}+ HC`}
                                            </Button>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    {/* Glassmorphism Background Accent */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-50/40 via-transparent to-indigo-50/40 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

                    <div className="rounded-[2rem] border border-white bg-white/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/40">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="py-5 pl-12 text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer group/header" onClick={() => handleSort("name")}>
                                        <div className="flex items-center group-hover/header:text-indigo-600 transition-colors">
                                            Company
                                            <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Market focus</TableHead>
                                    <TableHead className="py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Founders</TableHead>
                                    <TableHead className="py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Investors</TableHead>
                                    <TableHead className="py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center" onClick={() => handleSort("headcount")}>
                                        <div className="flex items-center justify-center group-hover/header:text-indigo-600 transition-colors cursor-pointer">
                                            Headcount
                                            <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="py-5 text-[11px] font-bold text-indigo-400 uppercase tracking-widest cursor-pointer group/header text-center" onClick={() => handleSort("match_score")}>
                                        <div className="flex items-center justify-center group-hover/header:text-indigo-600 transition-colors">
                                            Match
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="ml-1.5 h-3 w-3 text-slate-300" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 text-white border-none rounded-lg p-3 max-w-xs shadow-xl">
                                                    <p className="text-xs font-semibold mb-1">How we calculate this:</p>
                                                    <p className="text-[10px] text-slate-300 leading-relaxed font-normal">
                                                        <span className="text-indigo-400 font-bold">Heuristic</span>: Real-time keyword alignment.<br />
                                                        <span className="text-emerald-400 font-bold">AI Verified</span>: Deep technical confirmation.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest pr-12" onClick={() => handleSort("signal_score")}>
                                        <div className="flex items-center justify-center group-hover/header:text-indigo-600 transition-colors">
                                            Signals
                                            <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isAiSearching ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-96 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="relative h-20 w-20">
                                                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                                                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 animate-pulse" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">AI Reasoning Analysis</p>
                                                    <p className="text-sm text-slate-400 font-medium">Processing semantic match against institutional dataset...</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedCompanies.length > 0 ? (
                                    paginatedCompanies.map((company) => (
                                        <TableRow
                                            key={company.id}
                                            className={cn(
                                                "hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer group border-slate-50/60 relative",
                                                navigatingId === company.id && "bg-indigo-50/50 border-indigo-200"
                                            )}
                                            onClick={() => {
                                                if (navigatingId) return;
                                                setNavigatingId(company.id);
                                                router.push(`/companies/${company.id}`);
                                            }}
                                        >
                                            <TableCell className="py-5 pl-12">
                                                {navigatingId === company.id && (
                                                    <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300 rounded-2xl">
                                                        <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-full shadow-2xl scale-95 animate-in zoom-in-95 duration-300">
                                                            <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Engaging Dossier</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl border border-slate-100 bg-white p-2 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-500">
                                                        <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors text-base tracking-tight">
                                                                {company.name}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors truncate max-w-[220px]">
                                                            {company.website.replace("https://", "").replace("www.", "")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <Badge variant="outline" className="font-bold border-slate-200 text-slate-500 bg-slate-50/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-lg">
                                                    {company.industry}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                {company.founders && company.founders.length > 0 ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-1.5 cursor-default w-fit">
                                                                <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
                                                                    {company.founders[0].name.split(" ")[0]}
                                                                </span>
                                                                {company.founders.length > 1 && (
                                                                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5 shrink-0">
                                                                        +{company.founders.length - 1}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-900 border-none rounded-lg p-3 shadow-xl max-w-[200px]">
                                                            <div className="space-y-1">
                                                                {company.founders.map((f, i) => (
                                                                    <p key={i} className="text-[11px] font-bold text-white">{f.name}</p>
                                                                ))}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-5">
                                                {company.investors && company.investors.length > 0 ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-1.5 cursor-default w-fit">
                                                                {/* Lead investor initial avatar */}
                                                                <div className="h-6 w-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                                    <span className="text-[9px] font-black text-indigo-600 uppercase">
                                                                        {company.investors[0].name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-700 truncate max-w-[90px]">
                                                                    {company.investors[0].name}
                                                                </span>
                                                                {company.investors.length > 1 && (
                                                                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5 shrink-0">
                                                                        +{company.investors.length - 1}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-900 border-none rounded-xl p-3 shadow-2xl max-w-[220px]">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">All Investors</p>
                                                            <div className="space-y-1.5">
                                                                {company.investors.map((inv, i) => (
                                                                    <div key={i} className="flex items-center gap-2">
                                                                        <div className="h-5 w-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                                                            <span className="text-[8px] font-black text-indigo-300 uppercase">{inv.name.charAt(0)}</span>
                                                                        </div>
                                                                        <p className="text-[11px] font-bold text-white truncate">{inv.name}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-5 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-bold text-slate-700">
                                                        {company.headcount ? company.headcount.toLocaleString() : "—"}
                                                    </span>
                                                    {company.headcount_growth !== undefined && (
                                                        <span className={cn(
                                                            "text-[9px] font-black tracking-tighter",
                                                            company.headcount_growth > 0 ? "text-emerald-500" : "text-slate-400"
                                                        )}>
                                                            {company.headcount_growth > 0 ? `+${company.headcount_growth}%` : `${company.headcount_growth}%`}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-5">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    {company.match_score !== null && company.match_score !== undefined ? (
                                                        <>
                                                            <div className={cn(
                                                                "text-sm font-black tracking-tight",
                                                                company.match_score >= 80 ? "text-emerald-600" :
                                                                    company.match_score >= 60 ? "text-indigo-600" :
                                                                        "text-slate-400"
                                                            )}>
                                                                {company.match_score}%
                                                            </div>
                                                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        "h-full transition-all duration-1000",
                                                                        company.match_score >= 80 ? "bg-emerald-500" :
                                                                            company.match_score >= 60 ? "bg-indigo-500" :
                                                                                "bg-slate-300"
                                                                    )}
                                                                    style={{ width: `${company.match_score}%` }}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="text-slate-200 text-lg font-bold cursor-default select-none">—</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-slate-900 border-none rounded-lg p-2 shadow-xl max-w-[160px] text-center">
                                                                <p className="text-[10px] font-bold text-white">Click company to run AI Enrichment</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-5 pr-12">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="text-lg font-black text-slate-900 leading-none tracking-tighter">
                                                        {company.signal_score}
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={cn(
                                                                    "h-0.5 w-3 rounded-full",
                                                                    i < Math.floor(company.signal_score / 20) ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "bg-slate-100"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="p-4 bg-slate-50 rounded-full">
                                                    <Search className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-slate-400 font-medium tracking-tight">No institutional matches found for this query.</p>
                                                <Button
                                                    variant="link"
                                                    className="text-indigo-600 font-bold"
                                                    onClick={() => {
                                                        setSearch("");
                                                        setSelectedStages([]);
                                                        setSelectedIndustries([]);
                                                    }}
                                                >
                                                    Reset all discovery filters
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div >

                <div className="flex items-center justify-between py-6 px-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-white">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-slate-900">{((page - 1) * itemsPerPage) + 1}—{Math.min(page * itemsPerPage, filteredCompanies.length)}</span> of <span className="text-slate-900">{filteredCompanies.length}</span> companies
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.max(1, page - 1), "prev")}
                            disabled={page === 1 || pagingDirection !== null}
                            className="h-10 w-10 p-0 border-slate-200 bg-white rounded-xl shadow-sm hover:border-indigo-200 transition-all disabled:opacity-30 cursor-pointer"
                        >
                            {pagingDirection === "prev" ? <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> : <ChevronLeft className="h-5 w-5" />}
                        </Button>
                        <div className="text-xs font-bold text-slate-700 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm">
                            {page} <span className="text-slate-300 mx-1">/</span> {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.min(totalPages, page + 1), "next")}
                            disabled={page === totalPages || pagingDirection !== null}
                            className="h-10 w-10 p-0 border-slate-200 bg-white rounded-xl shadow-sm hover:border-indigo-200 transition-all disabled:opacity-30 cursor-pointer"
                        >
                            {pagingDirection === "next" ? <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> : <ChevronRight className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div >
        </TooltipProvider >
    );
}
