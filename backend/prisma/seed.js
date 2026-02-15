import bcrypt from "bcrypt";
import prisma from "../src/prisma/client.js";

async function seedAdmin() {
  const adminEmail = "admin@erp.local";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✔ Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✔ Admin user created");
}

async function main() {
  console.log("🌱 Seeding database...");
  await seedAdmin();
  console.log("🌱 Seeding complete");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
