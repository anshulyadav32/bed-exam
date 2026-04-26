import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:../db/prisma/dev.db"
        }
    }
});
async function main() {
    const count = await prisma.subject.count();
    console.log("Subject count:", count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
