import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";

export async function getCustomers({ page, limit, search, sortBy, sortOrder }) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.customer.count({ where }),
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

export async function getCustomerById(id) {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw new AppError("Customer not found", 404);
  return customer;
}

export async function getCustomerOptions() {
  return prisma.customer.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function createCustomer(data) {
  return prisma.customer.create({ data });
}

export async function updateCustomer(id, data) {
  await getCustomerById(id);
  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function toggleCustomerStatus(id, isActive) {
  await getCustomerById(id);
  return prisma.customer.update({
    where: { id },
    data: { isActive },
  });
}
