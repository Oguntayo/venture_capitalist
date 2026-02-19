import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Missing email or password" },
                { status: 400 }
            );
        }

        const passwordHash = await hash(password, 10);

        const newUser = await db.insert(users).values({
            email,
            passwordHash,
        }).returning();

        return NextResponse.json({ user: { email: newUser[0].email } });
    } catch (error: any) {
        if (error.code === "23505") {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
