import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";

export async function getSuppliers({
  page,
  limit,
  search,
  sortBy = "name",
  sortOrder = "asc",
}) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const orderBy = {
    [sortBy]: sortOrder,
  };

  const [data, total] = await prisma.$transaction([
    prisma.supplier.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.supplier.count({ where }),
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

export async function getSupplierById(id) {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
  });

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return supplier;
}

export async function getSupplierOptions() {
  return prisma.supplier.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function createSupplier(data) {
  const existing = await prisma.supplier.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError("Supplier name already exists", 400);
  }

  return prisma.supplier.create({ data });
}

export async function updateSupplier(id, data) {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
  });

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return prisma.supplier.update({
    where: { id },
    data,
  });
}

export async function toggleSupplierStatus(id, isActive) {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
  });

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return prisma.supplier.update({
    where: { id },
    data: { isActive },
  });
}
