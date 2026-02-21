import * as XLSX from "xlsx";
import { Company } from "./types";

function flattenCompany(c: Company, enrichment?: any) {
    return {
        Name: c.name,
        Industry: c.industry,
        Stage: c.stage,
        Location: c.location,
        Website: c.website,
        "Signal Score": c.signal_score,
        "AI Match Score": enrichment?.match_score || "N/A",
        "AI Summary": enrichment?.summary || "N/A",
        "AI Match Explanation": enrichment?.match_explanation || "N/A",
        Funding: c.funding,
        Founded: c.founded,
        Headcount: c.headcount || "N/A",
        "Headcount Growth (%)": c.headcount_growth || "N/A",
        Description: c.description,
        Tags: c.tags?.join(", ") || "",
        Investors: c.investors?.map((i: any) => i.name).join(", ") || "",
        Founders: c.founders?.map((f: any) => f.name).join(", ") || "",
        "Institutional Notes": c.userNotes || "N/A",
    };
}

export function exportCompaniesToExcel(companies: Company[]) {
    const data = companies.map(c => flattenCompany(c));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    const date = new Date().toISOString().split("T")[0];
    const filename = `VC_Scout_Export_${date}.xlsx`;
    XLSX.writeFile(workbook, filename);
}

export function exportCompanyToExcel(company: Company, enrichment?: any) {
    const data = [flattenCompany(company, enrichment)];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Company_Intelligence");
    XLSX.writeFile(workbook, `${company.name.replace(/\s+/g, "_")}_Export.xlsx`);
}

export function exportCompanyToCSV(company: Company, enrichment?: any) {
    const data = [flattenCompany(company, enrichment)];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${company.name.replace(/\s+/g, "_")}_Export.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportCompanyToJSON(company: Company, enrichment?: any) {
    const combinedData = {
        ...company,
        ai_intelligence: enrichment || null
    };
    const data = JSON.stringify(combinedData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${company.name.replace(/\s+/g, "_")}_Data.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
