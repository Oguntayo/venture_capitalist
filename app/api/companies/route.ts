import { getCompanies } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await getCompanies();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching companies:", error);
        return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
    }
}
