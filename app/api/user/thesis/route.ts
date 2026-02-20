import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ thesis: user.investmentThesis || "" });
    } catch (error) {
        console.error("Failed to fetch thesis:", error);
        return NextResponse.json({ error: "Failed to fetch thesis" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { thesis } = await req.json();

        await db
            .update(users)
            .set({ investmentThesis: thesis, updatedAt: new Date() })
            .where(eq(users.email, session.user.email));

        return NextResponse.json({ success: true, thesis });
    } catch (error) {
        console.error("Failed to update thesis:", error);
        return NextResponse.json({ error: "Failed to update thesis" }, { status: 500 });
    }
}
