"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    List,
    Search,
    Bookmark,
    LogOut,
    Activity,
    BarChart3
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Companies", href: "/companies", icon: Search },
    { name: "My Lists", href: "/lists", icon: List },
    { name: "Saved Searches", href: "/saved", icon: Bookmark },
    { name: "Performance", href: "/performance", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-slate-50/50">
            <div className="flex h-16 items-center px-6 border-b">
                <Activity className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-slate-900 tracking-tight">VC Scout</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Main Menu
                </div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t bg-white">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
