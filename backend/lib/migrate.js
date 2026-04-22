import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";

let migrated = false;

export async function runMigrations() {
    if (migrated) return;
    migrated = true;

    let schemaPath = join(process.cwd(), "db", "prisma", "schema.prisma");
    if (!fs.existsSync(schemaPath)) {
        schemaPath = join(process.cwd(), "..", "db", "prisma", "schema.prisma");
    }

    try {
        console.log("[db] Syncing schema…");
        const rootPrisma = join(process.cwd(), "node_modules", ".bin", "prisma");
        const backendPrisma = join(process.cwd(), "backend", "node_modules", ".bin", "prisma");
        
        let cmd = "npx prisma@5";
        if (fs.existsSync(rootPrisma)) {
            cmd = `"${rootPrisma}"`;
        } else if (fs.existsSync(backendPrisma)) {
            cmd = `"${backendPrisma}"`;
        }

        execSync(`${cmd} db push --schema "${schemaPath}"`, { stdio: "inherit" });
        console.log("[db] Schema synced.");
    } catch (err) {
        console.error("[db] Schema sync failed:", err.message);
        throw err;
    }
}
