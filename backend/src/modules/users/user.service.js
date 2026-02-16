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

export async function getUsers({
  page,
  limit,
  sortBy = "email",
  sortOrder = "asc",
}) {
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function toggleUserStatus(id, isActive) {
  return prisma.user.update({
    where: { id },
    data: { isActive },
  });
}
