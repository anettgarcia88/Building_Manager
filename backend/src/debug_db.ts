
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'; // Ensure .env is loaded

const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany();
    console.log(users);

    console.log('--- BUILDINGS ---');
    const buildings = await prisma.building.findMany();
    console.log(buildings);

    console.log('--- USER BUILDING ROLES ---');
    const roles = await prisma.userBuildingRole.findMany();
    console.log(roles);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
