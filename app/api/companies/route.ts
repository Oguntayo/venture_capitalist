import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "data", "companies.json");
        const jsonData = await fs.readFile(filePath, "utf8");
        const companies = JSON.parse(jsonData);
        return NextResponse.json(companies);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
    }
}
