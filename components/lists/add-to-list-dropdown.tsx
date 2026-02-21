"use client";

import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, ListPlus, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface List {
    id: string;
    name: string;
    companies: string[];
}

interface AddToListDropdownProps {
    companyId: string;
    className?: string;
    children?: React.ReactNode;
}

export function AddToListDropdown({ companyId, className, children }: AddToListDropdownProps) {
    const [lists, setLists] = useState<List[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const loadLists = () => {
            const savedLists = localStorage.getItem("vc-scout-lists");
            if (savedLists) {
                setLists(JSON.parse(savedLists));
            }
        };

        if (open) {
            loadLists();
        }

        const handleStorage = (e: StorageEvent) => {
            if (e.key === "vc-scout-lists") {
                loadLists();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [open]);

    const toggleCompanyInList = (listId: string) => {
        const updatedLists = lists.map((list) => {
            if (list.id === listId) {
                const alreadyHas = list.companies.includes(companyId);
                return {
                    ...list,
                    companies: alreadyHas
                        ? list.companies.filter((id) => id !== companyId)
                        : [...list.companies, companyId],
                };
            }
            return list;
        });

        setLists(updatedLists);
        localStorage.setItem("vc-scout-lists", JSON.stringify(updatedLists));
    };

    const createListAndAdd = () => {
        if (!newListName.trim()) return;

        const newList: List = {
            id: Math.random().toString(36).substr(2, 9),
            name: newListName.trim(),
            companies: [companyId],
        };

        const updatedLists = [...lists, newList];
        setLists(updatedLists);
        localStorage.setItem("vc-scout-lists", JSON.stringify(updatedLists));
        setNewListName("");
        setIsCreating(false);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors", className)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 overflow-hidden rounded-xl border-slate-200 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 py-2">
                    Add to List
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup className="max-h-48 overflow-y-auto">
                    {lists.length > 0 ? (
                        lists.map((list) => {
                            const isInList = list.companies.includes(companyId);
                            return (
                                <DropdownMenuItem
                                    key={list.id}
                                    onClick={() => toggleCompanyInList(list.id)}
                                    className="flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-slate-50 transition-colors"
                                >
                                    <span className={cn("text-sm font-medium", isInList ? "text-indigo-600" : "text-slate-600")}>
                                        {list.name}
                                    </span>
                                    {isInList && <Check className="h-4 w-4 text-indigo-600" />}
                                </DropdownMenuItem>
                            );
                        })
                    ) : (
                        <div className="py-4 px-3 text-center">
                            <p className="text-xs text-slate-400 italic">No lists yet</p>
                        </div>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {isCreating ? (
                    <div className="p-2 space-y-2 bg-slate-50/50">
                        <Input
                            autoFocus
                            placeholder="New list name..."
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="h-8 text-sm border-slate-200 bg-white"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") createListAndAdd();
                                if (e.key === "Escape") setIsCreating(false);
                            }}
                        />
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                className="flex-1 h-7 bg-indigo-600 text-xs"
                                onClick={createListAndAdd}
                            >
                                Create
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <DropdownMenuItem
                        className="cursor-pointer py-2 px-3 text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-2"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsCreating(true);
                        }}
                    >
                        <ListPlus className="h-4 w-4" />
                        Create New List
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
