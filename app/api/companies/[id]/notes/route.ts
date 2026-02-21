import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const company = await db.query.companies.findFirst({
            where: eq(companies.id, id),
            columns: { userNotes: true }
        });

        return NextResponse.json({ notes: company?.userNotes || "" });
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { notes } = await req.json();

        await db.update(companies)
            .set({ userNotes: notes, updatedAt: new Date() })
            .where(eq(companies.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
