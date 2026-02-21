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
        const fetchLists = async () => {
            try {
                const res = await fetch("/api/lists");
                if (res.ok) {
                    const data = await res.json();
                    if (data.length === 0) {
                        const createRes = await fetch("/api/lists", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name: "My Watchlist" })
                        });
                        if (createRes.ok) {
                            const newList = await createRes.json();
                            setLists([newList]);
                        }
                    } else {
                        setLists(data);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchLists();
    }, []);

    const toggleCompanyInList = async (listId: string) => {
        const list = lists.find((l) => l.id === listId);
        if (!list) return;

        const isPresent = list.companies.includes(companyId);
        const newCompanies = isPresent
            ? list.companies.filter((id) => id !== companyId)
            : [...list.companies, companyId];

        setLists(lists.map(l => l.id === listId ? { ...l, companies: newCompanies } : l));

        try {
            await fetch(`/api/lists/${listId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companies: newCompanies })
            });
        } catch (err) {
            console.error(err);
        }
    };

    const createList = async () => {
        if (!newListLabel.trim()) return;
        try {
            const res = await fetch("/api/lists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newListLabel })
            });
            if (res.ok) {
                const newList = await res.json();
                const addRes = await fetch(`/api/lists/${newList.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ companies: [companyId] })
                });

                if (addRes.ok) {
                    const updatedList = await addRes.json();
                    setLists([...lists, updatedList]);
                    setNewListLabel("");
                }
            }
        } catch (err) {
            console.error(err);
        }
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
