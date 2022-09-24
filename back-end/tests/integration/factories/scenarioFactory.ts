import { prisma} from "../../../src/database";

export async function deleteAllData() {
   prisma.$executeRaw`TRUNCATE TABLE recommendations`;
};

export async function disconnectPrisma() {
    await prisma.$disconnect();
}