import fs from "fs";
import path from "path";

function selectProfile(argv) {
    if (process.env.APP_ENV) return process.env.APP_ENV;

    const commandLine = argv.join(" ");
    if (commandLine.includes(" next dev") || argv.includes("dev")) return "development";
    if (commandLine.includes(" next start") || commandLine.includes(" next build")) return "production";
    if (commandLine.includes("prisma")) return process.env.NODE_ENV === "development" ? "development" : "production";

    return process.env.NODE_ENV === "production" ? "production" : "development";
}

function loadOptionalEnvFile(filePath) {
    if (!fs.existsSync(filePath) || typeof process.loadEnvFile !== "function") {
        return;
    }

    process.loadEnvFile(filePath);
}

const envDir = path.resolve(process.cwd(), "..", "env");
const profile = selectProfile(process.argv);

loadOptionalEnvFile(path.join(envDir, ".env.shared"));
loadOptionalEnvFile(path.join(envDir, `.env.${profile}`));
