"use client";

import { useState, useEffect } from "react";
import { Company } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Trash2,
    ExternalLink,
    ChevronRight,
    FileJson,
    FileSpreadsheet,
    ListPlus,
    Pencil,
    X,
    FolderPlus,
    Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface List {
    id: string;
    name: string;
    companies: string[];
}

export function ListsClient({ companies }: { companies: Company[] }) {
    const [lists, setLists] = useState<List[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [currentListName, setCurrentListName] = useState("");
    const [editingListId, setEditingListId] = useState<string | null>(null);

    useEffect(() => {
        const savedLists = localStorage.getItem("vc-scout-lists");
        if (savedLists) {
            setLists(JSON.parse(savedLists));
        }
    }, []);

    const saveLists = (updated: List[]) => {
        setLists(updated);
        localStorage.setItem("vc-scout-lists", JSON.stringify(updated));
    };

    const createList = () => {
        if (!currentListName.trim()) return;
        const newList: List = {
            id: Math.random().toString(36).substr(2, 9),
            name: currentListName.trim(),
            companies: [],
        };
        saveLists([...lists, newList]);
        setCurrentListName("");
        setIsCreateDialogOpen(false);
    };

    const renameList = () => {
        if (!currentListName.trim() || !editingListId) return;
        const updated = lists.map(l => l.id === editingListId ? { ...l, name: currentListName.trim() } : l);
        saveLists(updated);
        setCurrentListName("");
        setEditingListId(null);
        setIsRenameDialogOpen(false);
    };

    const deleteList = (id: string) => {
        const updated = lists.filter((l) => l.id !== id);
        saveLists(updated);
    };

    const removeCompanyFromList = (listId: string, companyId: string) => {
        const updated = lists.map(l => {
            if (l.id === listId) {
                return { ...l, companies: l.companies.filter(id => id !== companyId) };
            }
            return l;
        });
        saveLists(updated);
    };

    const exportList = (list: List, format: "csv" | "json") => {
        const listCompanies = companies.filter((c) => list.companies.includes(c.id));

        let content = "";
        let mimeType = "";
        const fileName = `${list.name.toLowerCase().replace(/ /g, "_")}.${format}`;

        if (format === "json") {
            content = JSON.stringify(listCompanies, null, 2);
            mimeType = "application/json";
        } else {
            const headers = "Name,Website,Industry,Stage,Funding,Location,Signal Score\n";
            const rows = listCompanies.map(c =>
                `"${c.name}","${c.website}","${c.industry}","${c.stage}","${c.funding}","${c.location}",${c.signal_score}`
            ).join("\n");
            content = headers + rows;
            mimeType = "text/csv";
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Custom Lists</h1>
                        <Badge className="bg-indigo-100 text-indigo-700 border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Premium</Badge>
                    </div>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl">Manage your curated collections of high-signal companies and export institutional-grade intelligence.</p>
                </div>
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-200 rounded-2xl h-14 px-8 flex items-center gap-3 transition-all active:scale-95 group"
                >
                    <FolderPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-bold">New Collection</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lists.length > 0 ? (
                    lists.map((list) => {
                        const listCompanies = companies.filter((c) => list.companies.includes(c.id));
                        const avgSignal = listCompanies.length > 0
                            ? Math.round(listCompanies.reduce((acc, c) => acc + c.signal_score, 0) / listCompanies.length)
                            : 0;

                        return (
                            <div key={list.id} className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                                <Card className="relative border-none bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden flex flex-col h-[480px] hover:shadow-2xl transition-all duration-300">
                                    {/* Card Header Gradient Area */}
                                    <div className="h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col justify-end relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 flex gap-1 z-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                                        <Download className="h-4.5 w-4.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100 mt-2">
                                                    <DropdownMenuItem onClick={() => exportList(list, "csv")} className="rounded-xl py-3 flex items-center gap-3 cursor-pointer">
                                                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                                                        <span className="font-bold text-sm">Export as CSV</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => exportList(list, "json")} className="rounded-xl py-3 flex items-center gap-3 cursor-pointer">
                                                        <FileJson className="h-4 w-4 text-indigo-500" />
                                                        <span className="font-bold text-sm">Export as JSON</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100 mt-2">
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditingListId(list.id);
                                                        setCurrentListName(list.name);
                                                        setIsRenameDialogOpen(true);
                                                    }} className="rounded-xl py-3 flex items-center gap-3 cursor-pointer">
                                                        <Pencil className="h-4 w-4 text-slate-400" />
                                                        <span className="font-bold text-sm">Rename Collection</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => deleteList(list.id)}
                                                        className="rounded-xl py-3 flex items-center gap-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="font-bold text-sm">Delete Collection</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Decorative background elements */}
                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>

                                        <div className="space-y-1 relative z-0">
                                            <h3 className="text-2xl font-black text-white tracking-tight truncate">{list.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-white/10 hover:bg-white/20 text-white/80 border-none font-black text-[10px] uppercase tracking-widest px-2 shadow-none">
                                                    {listCompanies.length} Entities
                                                </Badge>
                                                {listCompanies.length > 0 && (
                                                    <div className="flex items-center gap-1.5 px-2 h-5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/20">
                                                        <Zap className="h-2.5 w-2.5 fill-current" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{avgSignal} Momentum</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content Area */}
                                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-white/40">
                                        <ScrollArea className="flex-1 px-8 py-6">
                                            <div className="space-y-3">
                                                {listCompanies.length > 0 ? (
                                                    listCompanies.map((company) => (
                                                        <div
                                                            key={company.id}
                                                            className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group/item"
                                                        >
                                                            <Link
                                                                href={`/companies/${company.id}`}
                                                                className="flex items-center gap-4 flex-1"
                                                            >
                                                                <div className="h-10 w-10 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm group-hover/item:scale-105 transition-transform overflow-hidden">
                                                                    <img src={company.logo_url} alt="" className="h-full w-full object-contain" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-black text-slate-800 tracking-tight group-hover/item:text-indigo-600 transition-colors">{company.name}</span>
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{company.industry} • {company.stage}</span>
                                                                </div>
                                                            </Link>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-[10px] font-black text-slate-900">{company.signal_score}</span>
                                                                    <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                                                                        <div
                                                                            className={cn(
                                                                                "h-full rounded-full transition-all duration-1000",
                                                                                company.signal_score > 80 ? "bg-emerald-400" :
                                                                                    company.signal_score > 60 ? "bg-amber-400" : "bg-indigo-400"
                                                                            )}
                                                                            style={{ width: `${company.signal_score}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-xl"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        removeCompanyFromList(list.id, company.id);
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-[260px] text-center">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                                            <ListPlus className="h-8 w-8 text-slate-200" />
                                                        </div>
                                                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Curate your list</h4>
                                                        <p className="text-[10px] text-slate-400 mt-2 px-12 leading-relaxed">Add companies from the Discovery engine to start tracking signals.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>

                                        {/* Footer / Stats Area */}
                                        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100/50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">System Live</span>
                                            </div>
                                            <Button variant="ghost" className="h-8 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-white rounded-xl">
                                                Full Overview <ChevronRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/40 glass">
                        <div className="h-24 w-24 bg-gradient-to-br from-indigo-50 to-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ListPlus className="h-10 w-10 text-indigo-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Hub Empty</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-4 text-sm font-medium leading-relaxed">
                            Organize your investment workflow by curating high-signal companies into custom thematic collections for deep analysis and export.
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <Button asChild variant="outline" className="border-slate-200 h-12 px-8 rounded-2xl font-bold hover:bg-white text-slate-600 transition-all shadow-sm">
                                <Link href="/companies">Explore Market</Link>
                            </Button>
                            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95">
                                Create Collection
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Dialogs updated with premium styling */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">New Intelligence Hub</DialogTitle>
                        <DialogDescription className="text-slate-500 pt-2 font-medium">
                            Create a themed collection to track market shifts and institutional signals.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-8">
                        <Input
                            placeholder="e.g. Frontier Tech 2024"
                            value={currentListName}
                            onChange={(e) => setCurrentListName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && createList()}
                            className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 text-lg font-bold px-6"
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-4">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-12 rounded-2xl flex-1 text-slate-500 font-bold hover:bg-slate-50">Cancel</Button>
                        <Button onClick={createList} className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex-1 font-bold shadow-lg shadow-indigo-100">Initialize Hub</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight text-center">Refine Hub Name</DialogTitle>
                    </DialogHeader>
                    <div className="py-8">
                        <Input
                            placeholder="New Hub Name"
                            value={currentListName}
                            onChange={(e) => setCurrentListName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && renameList()}
                            className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 text-lg font-bold text-center px-6"
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-4">
                        <Button variant="ghost" onClick={() => setIsRenameDialogOpen(false)} className="h-12 rounded-2xl flex-1 text-slate-500 font-bold">Discard</Button>
                        <Button onClick={renameList} className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex-1 font-bold">Update Intelligence</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
