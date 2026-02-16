import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";
import AppError from "../../utils/AppError.js";

export async function createUser(data) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new AppError("Email already exists", 400);
  }

  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      role: data.role,
    },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleUserStatus(id, isActive) {
  return prisma.user.update({
    where: { id },
    data: { isActive },
  });
}
