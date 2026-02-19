import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@rms.com';
    const password = 'password123';
    const hashedPassword = await argon2.hash(password);

    console.log('Connecting to database...');

    // 1. Create Building if not exists
    let building = await prisma.building.findFirst();
    if (!building) {
        building = await prisma.building.create({
            data: {
                name: 'Edificio Principal',
                slug: 'edificio-principal',
                address: 'Av. Siempre Viva 123',
                status: 'ACTIVE',
            },
        });
        console.log('Created Building:', building.name);
    } else {
        console.log('Using existing Building:', building.name);
    }

    // 2. Create User
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: UserRole.ADMIN,
            },
        });
        console.log('Created User:', user.email);
    } else {
        // Update password just in case
        user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        console.log('Updated User password:', user.email);
    }

    // 3. Assign Role (Important for Multi-tenancy)
    const role = await prisma.userBuildingRole.findFirst({
        where: { userId: user.id, buildingId: building.id },
    });

    if (!role) {
        await prisma.userBuildingRole.create({
            data: {
                userId: user.id,
                buildingId: building.id,
                role: 'BUILDING_ADMIN',
            },
        });
        console.log('Assigned ADMIN role to user for building');
    }

    console.log(`\nLogin Credentials:\nEmail: ${email}\nPassword: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
