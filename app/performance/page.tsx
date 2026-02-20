"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    TrendingUp,
    Users,
    Zap,
    Search,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        name: "Discovery Coverage",
        value: "1,284",
        change: "+12.5%",
        trend: "up",
        icon: Search,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        name: "Thesis Alignment",
        value: "84.2%",
        change: "+5.1%",
        trend: "up",
        icon: Zap,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    {
        name: "Proprietary Alpha",
        value: "126",
        change: "+14.2%",
        trend: "up",
        icon: Activity,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        name: "Scouting Velocity",
        value: "4.2d",
        change: "-0.8d",
        trend: "up",
        icon: BarChart3,
        color: "text-amber-600",
        bg: "bg-amber-50"
    }
];

export default function PerformancePage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance Intelligence</h1>
                    <p className="text-slate-500 mt-1">
                        Monitoring your discovery engine health and pipeline activity.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <Card key={stat.name} className="border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                                        stat.trend === "up" ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                                    )}>
                                        {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Chart Placeholder */}
                    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                                Discovery Volume
                            </CardTitle>
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
                                <span className="text-xs text-slate-500">Last 30 Days</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[300px] w-full bg-slate-50 rounded-xl relative flex items-end p-6 gap-2 border border-slate-100 overflow-hidden">
                                {/* Simple CSS-based Bar Chart */}
                                {[45, 60, 40, 75, 90, 65, 55, 80, 70, 85, 95, 100].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-colors rounded-t-md group relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                                            {h * 12} events
                                        </div>
                                    </div>
                                ))}
                                <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200" />
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                                <span>Week 1</span>
                                <span>Week 2</span>
                                <span>Week 3</span>
                                <span>Week 4</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sector Distribution */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                                Sector Heat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {[
                                { name: "Artificial Intelligence", value: 85, color: "bg-indigo-500" },
                                { name: "Fintech", value: 62, color: "bg-blue-500" },
                                { name: "Healthtech", value: 45, color: "bg-emerald-500" },
                                { name: "SaaS", value: 38, color: "bg-amber-500" },
                                { name: "Energy", value: 24, color: "bg-rose-500" }
                            ].map((sector) => (
                                <div key={sector.name} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{sector.name}</span>
                                        <span className="text-slate-400">{sector.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", sector.color)}
                                            style={{ width: `${sector.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
