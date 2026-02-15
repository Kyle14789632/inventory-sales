import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";
import { createStockMovement } from "../inventory/inventory.service.js";

export async function getSalesOrders({ page, limit, search }) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        soNumber: { contains: search, mode: "insensitive" },
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.salesOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
    prisma.salesOrder.count({ where }),
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

export async function getSalesOrderById(id) {
  const so = await prisma.salesOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });

  if (!so) throw new AppError("Sales order not found", 404);

  return so;
}

function generateSONumber() {
  return `SO-${Date.now()}`;
}

export async function createSalesOrder(data) {
  const { customerId, items } = data;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });
  if (!customer) throw new AppError("Customer not found", 404);

  const totalAmount = items.reduce(
    (sum, i) => sum + i.quantity * i.sellingPrice,
    0,
  );

  return prisma.$transaction(async (tx) => {
    return tx.salesOrder.create({
      data: {
        soNumber: generateSONumber(),
        customerId,
        status: "DRAFT",
        totalAmount,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            sellingPrice: i.sellingPrice,
          })),
        },
      },
      include: { items: true, customer: true },
    });
  });
}

export async function updateSalesOrder(id, data) {
  const so = await prisma.salesOrder.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!so) throw new AppError("Sales order not found", 404);
  if (so.status !== "DRAFT")
    throw new AppError("Only DRAFT sales orders can be updated", 400);

  const totalAmount = data.items.reduce(
    (sum, i) => sum + i.quantity * i.sellingPrice,
    0,
  );

  return prisma.$transaction(async (tx) => {
    await tx.salesOrderItem.deleteMany({
      where: { salesOrderId: id },
    });

    return tx.salesOrder.update({
      where: { id },
      data: {
        customerId: data.customerId,
        totalAmount,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            sellingPrice: i.sellingPrice,
          })),
        },
      },
      include: { items: true, customer: true },
    });
  });
}

export async function confirmSalesOrder(id) {
  const so = await prisma.salesOrder.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!so) throw new AppError("Sales order not found", 404);
  if (so.status !== "DRAFT")
    throw new AppError("Only DRAFT sales orders can be confirmed", 400);

  return prisma.$transaction(async () => {
    for (const item of so.items) {
      await createStockMovement({
        productId: item.productId,
        type: "OUT",
        quantity: item.quantity,
        note: `SO ${so.soNumber} confirmed`,
      });
    }

    return prisma.salesOrder.update({
      where: { id },
      data: { status: "CONFIRMED" },
    });
  });
}

export async function completeSalesOrder(id) {
  const so = await prisma.salesOrder.findUnique({ where: { id } });
  if (!so) throw new AppError("Sales order not found", 404);
  if (so.status !== "CONFIRMED")
    throw new AppError("Only CONFIRMED sales orders can be completed", 400);

  return prisma.salesOrder.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
}
export async function cancelSalesOrder(id) {
  const so = await prisma.salesOrder.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!so) throw new AppError("Sales order not found", 404);
  if (so.status === "COMPLETED")
    throw new AppError("Completed sales orders cannot be cancelled", 400);

  return prisma.$transaction(async () => {
    if (so.status === "CONFIRMED")
      for (const item of so.items) {
        await createStockMovement({
          productId: item.productId,
          type: "IN",
          quantity: item.quantity,
          note: `SO ${so.soNumber} cancelled`,
        });
      }

    return prisma.salesOrder.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  });
}
