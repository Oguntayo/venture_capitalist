import "dotenv/config";
import { db } from "../lib/db";
import { companies as companiesTable } from "../lib/db/schema";

async function test() {
    try {
        console.log("🔍 Attempting to select from companies table...");
        const dbCompanies = await db.select().from(companiesTable);
        console.log(`✅ Success! Found ${dbCompanies.length} companies.`);
    } catch (error: any) {
        console.error("❌ Database query failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.code) console.error("Error Code:", error.code);
        if (error.detail) console.error("Error Detail:", error.detail);
        if (error.hint) console.error("Error Hint:", error.hint);
    }
    process.exit(0);
}

test();
