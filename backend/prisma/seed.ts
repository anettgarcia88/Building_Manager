
import { PrismaClient, UserRole, BuildingUserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@rms.com';
    const password = 'password123';
    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: UserRole.ADMIN,
        },
        create: {
            email,
            password: hashedPassword,
            role: UserRole.ADMIN,
        },
    });

    const building = await prisma.building.upsert({
        where: { slug: 'edificio-demo' },
        update: {},
        create: {
            name: 'Edificio Demo',
            slug: 'edificio-demo',
            address: 'Av. Corrientes 1234',
        },
    });

    // Crear relación de rol de usuario en el edificio
    const userBuildingRole = await prisma.userBuildingRole.upsert({
        where: {
            userId_buildingId: {
                userId: user.id,
                buildingId: building.id,
            },
        },
        update: {
            role: BuildingUserRole.BUILDING_ADMIN,
        },
        create: {
            userId: user.id,
            buildingId: building.id,
            role: BuildingUserRole.BUILDING_ADMIN,
            firstName: 'Admin',
            lastName1: 'Sistema',
        },
    });

    console.log({ user, building, userBuildingRole });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });