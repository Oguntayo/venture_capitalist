"use client";

import { useState, useMemo } from "react";
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
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Bookmark, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
    const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: "asc" | "desc" } | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const [saveName, setSaveName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const updateUrl = useCallback((q: string, stages: string[], industries: string[]) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (stages.length) params.set("stages", stages.join(","));
        if (industries.length) params.set("industries", industries.join(","));

        const queryString = params.toString();
        router.replace(`/companies${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }, [router]);

    useEffect(() => {
        updateUrl(search, selectedStages, selectedIndustries);
    }, [search, selectedStages, selectedIndustries, updateUrl]);

    const saveSearch = () => {
        if (!saveName) return;
        const newSearch = {
            id: Math.random().toString(36).substr(2, 9),
            name: saveName,
            query: search,
            filters: {
                stages: selectedStages,
                industries: selectedIndustries,
            }
        };
        const existing = JSON.parse(localStorage.getItem("vc-scout-saved-searches") || "[]");
        localStorage.setItem("vc-scout-saved-searches", JSON.stringify([...existing, newSearch]));
        setSaveName("");
        setIsSaving(false);
    };

    const filteredCompanies = useMemo(() => {
        return initialCompanies
            .filter((c) => {
                const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.industry.toLowerCase().includes(search.toLowerCase());
                const matchesStage = selectedStages.length === 0 || selectedStages.includes(c.stage);
                const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(c.industry);
                return matchesSearch && matchesStage && matchesIndustry;
            })
            .sort((a, b) => {
                if (!sortConfig) return 0;
                const { key, direction } = sortConfig;
                if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
                if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
                return 0;
            });
    }, [initialCompanies, search, selectedStages, selectedIndustries, sortConfig]);

    const paginatedCompanies = filteredCompanies.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

    const handleSort = (key: keyof Company) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                return { key, direction: current.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "desc" };
        });
    };

    const toggleStage = (stage: string) => {
        setSelectedStages((prev) =>
            prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
        );
        setPage(1);
    };

    const toggleIndustry = (industry: string) => {
        setSelectedIndustries((prev) =>
            prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
        );
        setPage(1);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between h-auto mt-2">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search companies, industries..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-white border-slate-200"
                    />
                </div>

                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-slate-200 bg-white text-slate-600">
                                <Filter className="mr-2 h-4 w-4" />
                                Stage
                                {selectedStages.length > 0 && (
                                    <Badge variant="secondary" className="ml-2 bg-indigo-50 text-indigo-700">
                                        {selectedStages.length}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Filter by Stage</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {STAGES.map((stage) => (
                                <DropdownMenuCheckboxItem
                                    key={stage}
                                    checked={selectedStages.includes(stage)}
                                    onCheckedChange={() => toggleStage(stage)}
                                >
                                    {stage}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-slate-200 bg-white text-slate-600">
                                <Filter className="mr-2 h-4 w-4" />
                                Industry
                                {selectedIndustries.length > 0 && (
                                    <Badge variant="secondary" className="ml-2 bg-indigo-50 text-indigo-700">
                                        {selectedIndustries.length}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Filter by Industry</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {INDUSTRIES.map((industry) => (
                                <DropdownMenuCheckboxItem
                                    key={industry}
                                    checked={selectedIndustries.includes(industry)}
                                    onCheckedChange={() => toggleIndustry(industry)}
                                >
                                    {industry}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="border-l border-slate-200 ml-2 pl-4 flex items-center">
                        <Dialog open={isSaving} onOpenChange={setIsSaving}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 h-10 px-4">
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    Save Workflow
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Save Discovery Workflow</DialogTitle>
                                    <DialogDescription>
                                        Save these filters and search terms to your dashboard for quick access later.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        placeholder="E.g., Seed AI in SF"
                                        value={saveName}
                                        onChange={(e) => setSaveName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && saveSearch()}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsSaving(false)}>Cancel</Button>
                                    <Button onClick={saveSearch} className="bg-indigo-600 hover:bg-indigo-700">Save Search</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead onClick={() => handleSort("name")} className="cursor-pointer hover:text-indigo-600 transition-colors">
                                <div className="flex items-center">
                                    Company
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead onClick={() => handleSort("signal_score")} className="cursor-pointer hover:text-indigo-600 transition-colors">
                                <div className="flex items-center">
                                    Signal Score
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCompanies.length > 0 ? (
                            paginatedCompanies.map((company) => (
                                <TableRow
                                    key={company.id}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    onClick={() => router.push(`/companies/${company.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg border bg-white p-1 flex items-center justify-center shrink-0">
                                                <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {company.name}
                                                </div>
                                                <div className="text-xs text-slate-400 truncate max-w-[200px]">
                                                    {company.website.replace("https://", "")}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal border-slate-200 text-slate-600 px-2 py-0">
                                            {company.industry}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-500 hover:bg-slate-200 px-2 py-0">
                                            {company.stage}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        company.signal_score > 80 ? "bg-emerald-500" : company.signal_score > 50 ? "bg-amber-400" : "bg-slate-300"
                                                    )}
                                                    style={{ width: `${company.signal_score}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{company.signal_score}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic">
                                    No companies found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-2 px-1">
                <div className="text-sm text-slate-500">
                    Showing <span className="font-medium text-slate-900">{((page - 1) * itemsPerPage) + 1}</span> to{" "}
                    <span className="font-medium text-slate-900">{Math.min(page * itemsPerPage, filteredCompanies.length)}</span> of{" "}
                    <span className="font-medium text-slate-900">{filteredCompanies.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-8 w-8 p-0 border-slate-200 bg-white"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-xs font-medium text-slate-600">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="h-8 w-8 p-0 border-slate-200 bg-white"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
