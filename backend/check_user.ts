
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@rms.com';
    const password = 'password123';

    console.log(`Checking user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User NOT found in database.');
        return;
    }

    console.log('User found:', user.email);
    console.log('Stored Hash:', user.password);

    console.log('Verifying password...');
    try {
        const isValid = await argon2.verify(user.password, password);
        console.log(`Password '${password}' is valid: ${isValid}`);
    } catch (e) {
        console.error('Error verifying password:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
