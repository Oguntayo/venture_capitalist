"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ListPlus, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SaveToListButtonProps {
    companyId: string;
    companyName: string;
}

export function SaveToListButton({ companyId, companyName }: SaveToListButtonProps) {
    const [lists, setLists] = useState<{ id: string; name: string; companies: string[] }[]>([]);
    const [newListLabel, setNewListLabel] = useState("");

    useEffect(() => {
        const savedLists = localStorage.getItem("vc-scout-lists");
        if (savedLists) {
            setLists(JSON.parse(savedLists));
        } else {
            const defaultLists = [{ id: "default", name: "My Watchlist", companies: [] }];
            setLists(defaultLists);
            localStorage.setItem("vc-scout-lists", JSON.stringify(defaultLists));
        }
    }, []);

    const toggleCompanyInList = (listId: string) => {
        const updatedLists = lists.map((list) => {
            if (list.id === listId) {
                const isPresent = list.companies.includes(companyId);
                return {
                    ...list,
                    companies: isPresent
                        ? list.companies.filter((id) => id !== companyId)
                        : [...list.companies, companyId],
                };
            }
            return list;
        });
        setLists(updatedLists);
        localStorage.setItem("vc-scout-lists", JSON.stringify(updatedLists));
    };

    const createList = () => {
        if (!newListLabel.trim()) return;
        const newList = {
            id: Math.random().toString(36).substr(2, 9),
            name: newListLabel,
            companies: [companyId],
        };
        const updatedLists = [...lists, newList];
        setLists(updatedLists);
        localStorage.setItem("vc-scout-lists", JSON.stringify(updatedLists));
        setNewListLabel("");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-200 rounded-2xl px-6 py-6 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all shadow-sm">
                    <ListPlus className="mr-2 h-4 w-4 text-indigo-500" />
                    Add to List
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Save {companyName} to...</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {lists.map((list) => (
                    <DropdownMenuCheckboxItem
                        key={list.id}
                        checked={list.companies.includes(companyId)}
                        onCheckedChange={() => toggleCompanyInList(list.id)}
                    >
                        {list.name}
                    </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <div className="p-2 flex gap-2">
                    <Input
                        size={1}
                        placeholder="New list..."
                        value={newListLabel}
                        onChange={(e) => setNewListLabel(e.target.value)}
                        className="h-8 text-xs"
                        onKeyDown={(e) => e.key === "Enter" && createList()}
                    />
                    <Button size="icon" variant="secondary" className="h-8 w-8 shrink-0" onClick={createList}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
