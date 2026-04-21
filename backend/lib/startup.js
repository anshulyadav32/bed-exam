import { runMigrations } from "./migrate.js";
import { seed } from "./seed.js";

let started = false;

export async function ensureStarted() {
    if (started) return;
    started = true;
    try {
        await runMigrations();
    } catch (err) {
        console.error("[db] Migration failed:", err.message);
        // Continue anyway - tables might already exist
    }
    try {
        await seed();
    } catch (err) {
        console.error("[db] Seeding failed:", err.message);
        // Don't throw - allow app to run even if seeding fails
    }
}
