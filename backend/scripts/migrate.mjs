import { execSync } from "child_process";
import path from "path";
import "../../env/load-env.mjs";

const schemaPath = path.resolve(process.cwd(), "..", "db", "prisma", "schema.prisma");

execSync(`npx prisma db push --schema "${schemaPath}"`, { stdio: "inherit" });
