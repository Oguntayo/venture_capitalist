"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            router.push("/companies");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <Card className="w-full max-w-md border-slate-200/60 shadow-xl shadow-slate-200/50">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-200">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight uppercase italic text-slate-900">Welcome back</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Institutional Access Protocol
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <Input
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-50/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-50/50"
                            />
                        </div>
                        {error && <p className="text-sm font-medium text-rose-500">{error}</p>}
                        <Button className="w-full bg-slate-900 hover:bg-black text-white h-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95" type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t bg-slate-50/50 py-4">
                    <div className="text-sm text-center text-slate-500">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={() => {
                                setIsNavigating(true);
                                router.push("/auth/register");
                            }}
                            disabled={isNavigating}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors inline-flex items-center"
                        >
                            {isNavigating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                            Create an account
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
