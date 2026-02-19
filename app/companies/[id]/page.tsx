import { promises as fs } from "fs";
import path from "path";
import { Company } from "@/lib/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Globe,
    MapPin,
    Calendar,
    DollarSign,
    ArrowLeft,
    TrendingUp,
    UserPlus,
    FileText
} from "lucide-react";
import Link from "next/link";
import { EnrichmentCard } from "@/app/companies/[id]/enrichment-card";
import { SaveToListButton } from "@/app/companies/[id]/save-to-list-button";
import { CompanyNotes } from "@/app/companies/[id]/company-notes";


export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const filePath = path.join(process.cwd(), "data", "companies.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const companies: Company[] = JSON.parse(jsonData);

    const company = companies.find((c) => c.id === id);

    if (!company) {
        notFound();
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Link href="/companies" className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Companies
                </Link>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        {/* Main Profile Header */}
                        <Card className="border-slate-200 overflow-hidden shadow-sm">
                            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
                            <CardContent className="pt-0 relative">
                                <div className="absolute -top-12 left-6 h-24 w-24 rounded-2xl border-4 border-white bg-white p-2 shadow-lg">
                                    <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain" />
                                </div>

                                <div className="pt-16 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3">
                                                    {company.industry}
                                                </Badge>
                                                <Badge variant="outline" className="text-slate-500 border-slate-200">
                                                    {company.stage}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <SaveToListButton companyId={company.id} companyName={company.name} />
                                            <div className="flex flex-col items-end">
                                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Signal Score</div>
                                                <div className="text-4xl font-black text-indigo-600 tracking-tight">{company.signal_score}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-6 text-slate-600 leading-relaxed max-w-2xl text-lg">
                                        {company.description}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-100">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <Globe className="h-3 w-3 mr-1.5" />
                                                Website
                                            </div>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline flex items-center">
                                                {company.website.replace("https://", "")}
                                            </a>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <MapPin className="h-3 w-3 mr-1.5" />
                                                Location
                                            </div>
                                            <div className="text-sm font-medium text-slate-700">{company.location}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <DollarSign className="h-3 w-3 mr-1.5" />
                                                Funding
                                            </div>
                                            <div className="text-sm font-medium text-slate-700">${company.funding}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <Calendar className="h-3 w-3 mr-1.5" />
                                                Founded
                                            </div>
                                            <div className="text-sm font-medium text-slate-700">{company.founded}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Signal Timeline placeholder */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                                    Growth Signals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-1 before:w-[2px] before:bg-slate-100 ml-2">
                                    {[
                                        { date: "2 days ago", event: "Featured in 'Top AI Startups 2026' newsletter", icon: Globe, color: "bg-blue-500" },
                                        { date: "1 week ago", event: "Founder mentioned 'Series B expansion' in podcast", icon: UserPlus, color: "bg-purple-500" },
                                        { date: "2 weeks ago", event: "Published new whitepaper on LLM optimization", icon: FileText, color: "bg-indigo-500" },
                                        { date: "1 month ago", event: "Hiring for 12 new engineering and research roles", icon: UserPlus, color: "bg-emerald-500" },
                                        { date: "2 months ago", event: "Beta launch of Enterprise Workflow Engine", icon: TrendingUp, color: "bg-amber-500" },
                                    ].map((signal, i) => (
                                        <div key={i} className="flex gap-6 relative pl-6">
                                            <div className={`absolute left-[-5px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${signal.color} shadow-sm z-10`} />
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900 leading-none">{signal.event}</div>
                                                <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                                                    <signal.icon className="h-3 w-3" />
                                                    {signal.date}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="w-full lg:w-[400px] space-y-6">
                        <EnrichmentCard companyId={company.id} website={company.website} />
                        <CompanyNotes companyId={company.id} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
