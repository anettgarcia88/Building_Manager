import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBuildingRoles() {
    console.log('🔧 Actualizando registros de UserBuildingRole...\n');

    // Actualizar todos los registros que no tengan firstName y lastName1
    const updated = await prisma.userBuildingRole.updateMany({
        where: {
            OR: [
                { firstName: null },
                { lastName1: null },
            ],
        },
        data: {
            firstName: 'Admin',
            lastName1: 'Sistema',
        },
    });

    console.log(`✅ Se actualizaron ${updated.count} registros`);

    // Mostrar todos los edificios con sus admins
    const buildings = await prisma.userBuildingRole.findMany({
        include: {
            user: { select: { email: true } },
            building: { select: { name: true, slug: true } },
        },
    });

    console.log('\n📊 Estado actual:\n');
    buildings.forEach((role) => {
        console.log(`  ${role.user.email} → ${role.building.name} (${role.building.slug})`);
        console.log(`    Nombre: ${role.firstName} ${role.lastName1}`);
        console.log(`    Rol: ${role.role}\n`);
    });
}

fixBuildingRoles()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
