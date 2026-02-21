import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Singleton pattern to prevent multiple connections in development
const globalForDb = global as unknown as {
    client: postgres.Sql | undefined;
};

// High resiliency configuration for hosted DBs (e.g. Neon)
export const client = globalForDb.client ?? postgres(connectionString, {
    prepare: false,
    connect_timeout: 60, // 60 seconds for cold starts
    idle_timeout: 30,    // 30 seconds
    max: 10,             // Max connections
    ssl: "require",      // Enforce SSL for security and stability
});

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
