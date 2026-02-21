import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { lists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { companies, name } = body;

        const updatedList = await db.update(lists)
            .set({
                ...(companies ? { companies } : {}),
                ...(name ? { name } : {}),
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(lists.id, id),
                    eq(lists.userId, (session.user as any).id)
                )
            )
            .returning();

        return NextResponse.json(updatedList[0]);
    } catch (error) {
        console.error("[LIST_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const deletedList = await db.delete(lists)
            .where(
                and(
                    eq(lists.id, id),
                    eq(lists.userId, (session.user as any).id)
                )
            )
            .returning();

        return NextResponse.json(deletedList[0]);
    } catch (error) {
        console.error("[LIST_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
