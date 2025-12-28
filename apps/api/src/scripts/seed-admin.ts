import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../common/utils/password.util';

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = 'amalanilkumar282@gmail.com';
  const plainPassword = 'Amal@123';
  const hashedPassword = await hashPassword(plainPassword);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('⚠️ Admin already exists');
    return;
  }

  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Admin seeded successfully');
}

seedAdmin()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
