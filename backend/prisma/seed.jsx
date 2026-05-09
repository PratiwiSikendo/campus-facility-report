const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Buat kategori
  await prisma.category.createMany({
    data: [
      { name: 'Listrik' },
      { name: 'AC / Pendingin' },
      { name: 'Toilet / Sanitasi' },
      { name: 'Furniture' },
      { name: 'Komputer / Proyektor' },
      { name: 'Lainnya' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Kategori berhasil dibuat');

  // Buat akun admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kampus.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@kampus.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Akun admin berhasil dibuat');
  console.log('   Email    : admin@kampus.com');
  console.log('   Password : admin123');

  // Buat akun petugas
  const hashedPassword2 = await bcrypt.hash('petugas123', 10);
  await prisma.user.upsert({
    where: { email: 'petugas@kampus.com' },
    update: {},
    create: {
      name: 'Petugas Fasilitas',
      email: 'petugas@kampus.com',
      password: hashedPassword2,
      role: 'PETUGAS',
    },
  });
  console.log('✅ Akun petugas berhasil dibuat');
  console.log('   Email    : petugas@kampus.com');
  console.log('   Password : petugas123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });