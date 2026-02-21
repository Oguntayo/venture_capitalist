import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { lists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userLists = await db.query.lists.findMany({
            where: eq(lists.userId, (session.user as any).id),
            orderBy: (lists, { desc }) => [desc(lists.updatedAt)],
        });

        return NextResponse.json(userLists);
    } catch (error) {
        console.error("[LISTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const newList = await db.insert(lists).values({
            userId: (session.user as any).id,
            name,
            companies: [],
        }).returning();

        return NextResponse.json(newList[0]);
    } catch (error) {
        console.error("[LISTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
