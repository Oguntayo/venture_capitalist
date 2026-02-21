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
    Zap,
    MoreHorizontal,
    Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
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
        const fetchLists = async () => {
            try {
                const res = await fetch("/api/lists");
                if (res.ok) {
                    const data = await res.json();
                    setLists(data);
                }
            } catch (err) {
                console.error("Failed to fetch lists", err);
            }
        };
        fetchLists();
    }, []);

    const createList = async () => {
        if (!currentListName.trim()) return;
        try {
            const res = await fetch("/api/lists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: currentListName.trim() }),
            });
            if (res.ok) {
                const newList = await res.json();
                setLists([...lists, newList]);
                setCurrentListName("");
                setIsCreateDialogOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renameList = async () => {
        if (!currentListName.trim() || !editingListId) return;
        try {
            const res = await fetch(`/api/lists/${editingListId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: currentListName.trim() }),
            });
            if (res.ok) {
                const updatedList = await res.json();
                setLists(lists.map(l => l.id === editingListId ? updatedList : l));
                setCurrentListName("");
                setEditingListId(null);
                setIsRenameDialogOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteList = async (id: string) => {
        try {
            const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });
            if (res.ok) {
                setLists(lists.filter((l) => l.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const removeCompanyFromList = async (listId: string, companyId: string) => {
        const list = lists.find(l => l.id === listId);
        if (!list) return;
        const newCompanies = list.companies.filter(id => id !== companyId);
        try {
            const res = await fetch(`/api/lists/${listId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companies: newCompanies }),
            });
            if (res.ok) {
                const updatedList = await res.json();
                setLists(lists.map(l => l.id === listId ? updatedList : l));
            }
        } catch (err) {
            console.error(err);
        }
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
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Saved Lists</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Asset Collections</p>
                </div>
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-slate-900 hover:bg-indigo-600 text-white shadow-xl rounded-xl h-12 px-6 flex items-center gap-2 transition-all active:scale-95 group"
                >
                    <FolderPlus className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">New Collection</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                {lists.length > 0 ? (
                    lists.map((list) => {
                        const listCompanies = companies.filter((c) => list.companies.includes(c.id));
                        const avgSignal = listCompanies.length > 0
                            ? Math.round(listCompanies.reduce((acc, c) => acc + c.signal_score, 0) / listCompanies.length)
                            : 0;

                        return (
                            <Card key={list.id} className="relative border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden flex flex-col h-[500px] hover:shadow-indigo-500/10 transition-all duration-700 group border border-slate-50">
                                <div className="p-8 pb-4 flex items-start justify-between">
                                    <div className="space-y-1 overflow-hidden">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tighter truncate">{list.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{listCompanies.length} Entities</span>
                                            {listCompanies.length > 0 && (
                                                <div className="flex items-center gap-1 text-indigo-600">
                                                    <Zap className="h-2.5 w-2.5 fill-current" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100 mt-2">
                                            <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Management</div>
                                            <DropdownMenuItem onClick={() => {
                                                setEditingListId(list.id);
                                                setCurrentListName(list.name);
                                                setIsRenameDialogOpen(true);
                                            }} className="rounded-xl py-3 flex items-center gap-3 cursor-pointer">
                                                <Pencil className="h-4 w-4 text-slate-400" />
                                                <span className="font-bold text-sm">Rename</span>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="bg-slate-50" />

                                            <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol</div>
                                            <DropdownMenuItem onClick={() => exportList(list, "csv")} className="rounded-xl py-3 flex items-center gap-3 cursor-pointer">
                                                <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                                                <span className="font-bold text-sm">Export CSV</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => exportList(list, "json")} className="rounded-xl py-3 flex items-center gap-3 cursor-pointer">
                                                <FileJson className="h-4 w-4 text-indigo-500" />
                                                <span className="font-bold text-sm">Export JSON</span>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="bg-slate-50" />

                                            <DropdownMenuItem
                                                onClick={() => deleteList(list.id)}
                                                className="rounded-xl py-3 flex items-center gap-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="font-bold text-sm">Delete Hub</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>


                                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden min-h-0">
                                    <ScrollArea className="flex-1 px-8 py-4 h-full min-h-0">
                                        <div className="space-y-4">
                                            {listCompanies.length > 0 ? (
                                                listCompanies.map((company) => (
                                                    <div
                                                        key={company.id}
                                                        className="group/item relative flex items-center gap-4 animate-in fade-in slide-in-from-right-2 duration-500"
                                                    >
                                                        <Link
                                                            href={`/companies/${company.id}`}
                                                            className="flex items-center gap-x-4 flex-1 py-1"
                                                        >
                                                            <div className="h-10 w-10 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm group-hover/item:scale-105 transition-all overflow-hidden shrink-0">
                                                                <img src={company.logo_url} alt="" className="h-full w-full object-contain grayscale opacity-60 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-xs font-black text-slate-800 tracking-tight group-hover/item:text-indigo-600 transition-colors truncate">{company.name}</span>
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{company.industry}</span>
                                                            </div>
                                                        </Link>

                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col items-end shrink-0">
                                                                <span className="text-[10px] font-black text-slate-900 italic">{company.signal_score}</span>
                                                                <div className="w-6 h-0.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                                                                    <div
                                                                        className={cn(
                                                                            "h-full rounded-full transition-all duration-1000",
                                                                            company.signal_score > 80 ? "bg-emerald-500" :
                                                                                company.signal_score > 60 ? "bg-indigo-500" : "bg-slate-300"
                                                                        )}
                                                                        style={{ width: `${company.signal_score}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-rose-500 transition-all rounded-lg"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    removeCompanyFromList(list.id, company.id);
                                                                }}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-[280px] text-center">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                                        <ListPlus className="h-6 w-6 text-slate-200" />
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Hub Empty</p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>


                                    <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Monitoring</span>
                                        </div>
                                        <Link
                                            href="/companies"
                                            className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest italic flex items-center gap-1"
                                        >
                                            Discover <ChevronRight className="h-2.5 w-2.5" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="col-span-full py-24 text-center border border-slate-100 border-dashed rounded-[3rem] bg-slate-50/20">
                        <div className="h-20 w-20 bg-white shadow-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-in zoom-in-95 duration-1000">
                            <ListPlus className="h-8 w-8 text-indigo-100" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">No Signal Collections</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mt-2 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Initialize a hub from the discovery engine to begin tracking thematic institutional intelligence.
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-12">
                            <Button asChild variant="outline" className="border-slate-200 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white text-slate-500 shadow-sm transition-all active:scale-95">
                                <Link href="/companies">Discover Assets</Link>
                            </Button>
                            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-slate-900 hover:bg-indigo-600 text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
                                Initialize Hub
                            </Button>
                        </div>
                    </div>
                )}
            </div>


            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[3rem] border border-slate-50 shadow-2xl p-12">
                    <DialogHeader className="items-center text-center">
                        <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">New Intelligence Hub</DialogTitle>
                        <DialogDescription className="text-slate-400 pt-2 text-[10px] font-bold uppercase tracking-widest">
                            Thematic Collection Initialization
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-10">
                        <Input
                            placeholder="e.g. Frontier Tech 2024"
                            value={currentListName}
                            onChange={(e) => setCurrentListName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && createList()}
                            className="h-16 bg-slate-50 border-none rounded-2xl focus-visible:ring-indigo-600 text-lg font-bold px-8 placeholder:text-slate-300 text-slate-900 text-center uppercase tracking-tight"
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-4">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-12 rounded-2xl flex-1 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancel</Button>
                        <Button onClick={createList} className="h-12 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl flex-1 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Initialize</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[3rem] border border-slate-50 shadow-2xl p-12">
                    <DialogHeader className="items-center text-center">
                        <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Refine Prototype</DialogTitle>
                        <DialogDescription className="text-slate-400 pt-2 text-[10px] font-bold uppercase tracking-widest">
                            Update Intelligence Label
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-10">
                        <Input
                            placeholder="New Hub Name"
                            value={currentListName}
                            onChange={(e) => setCurrentListName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && renameList()}
                            className="h-16 bg-slate-50 border-none rounded-2xl focus-visible:ring-indigo-600 text-lg font-bold px-8 text-slate-900 text-center uppercase tracking-tight"
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-4">
                        <Button variant="ghost" onClick={() => setIsRenameDialogOpen(false)} className="h-12 rounded-2xl flex-1 text-slate-400 text-[10px] font-black uppercase tracking-widest">Discard</Button>
                        <Button onClick={renameList} className="h-12 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl flex-1 text-[10px] font-black uppercase tracking-widest">Confirm Refinement</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
