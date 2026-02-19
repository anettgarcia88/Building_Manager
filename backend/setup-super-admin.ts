import { PrismaClient, BuildingUserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function setupSuperAdmin() {
    const email = 'admin@rms.com';

    // 1. Obtener el usuario admin
    const adminUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!adminUser) {
        console.error(`❌ Usuario ${email} no encontrado`);
        process.exit(1);
    }

    console.log(`✅ Usuario admin encontrado: ${adminUser.email}`);

    // 2. Obtener todos los edificios
    const buildings = await prisma.building.findMany();

    if (buildings.length === 0) {
        console.log('⚠️  No hay edificios creados aún');
        process.exit(0);
    }

    console.log(`\n📊 Se encontraron ${buildings.length} edificio(s):`);
    buildings.forEach((b) => console.log(`  - ${b.name} (${b.slug})`));

    // 3. Asignar admin como BUILDING_ADMIN en todos los edificios
    console.log(`\n🔧 Asignando admin a todos los edificios...`);

    for (const building of buildings) {
        const existingRole = await prisma.userBuildingRole.findUnique({
            where: {
                userId_buildingId: {
                    userId: adminUser.id,
                    buildingId: building.id,
                },
            },
        });

        if (existingRole) {
            // Actualizar si ya existe
            if (existingRole.role !== BuildingUserRole.BUILDING_ADMIN) {
                await prisma.userBuildingRole.update({
                    where: { id: existingRole.id },
                    data: { role: BuildingUserRole.BUILDING_ADMIN },
                });
                console.log(`  ✏️  Actualizado: ${building.name} → BUILDING_ADMIN`);
            } else {
                console.log(`  ✅ Ya era admin en: ${building.name}`);
            }
        } else {
            // Crear nueva relación
            await prisma.userBuildingRole.create({
                data: {
                    userId: adminUser.id,
                    buildingId: building.id,
                    role: BuildingUserRole.BUILDING_ADMIN,
                    firstName: 'Admin',
                    lastName1: 'Super',
                },
            });
            console.log(`  ✅ Agregado a: ${building.name}`);
        }
    }

    console.log(`\n✨ ¡Configuración completada!`);
    console.log(`\n🔑 Credenciales del Super Admin:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: password123`);
    console.log(`   Edificios: ${buildings.length} (acceso completo a todos)`);
}

setupSuperAdmin()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
