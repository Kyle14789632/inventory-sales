import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";
import { createStockMovement } from "../inventory/inventory.service.js";

export async function getPurchaseOrders({ page, limit, search }) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        poNumber: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.purchaseOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        supplier: true,
      },
    }),
    prisma.purchaseOrder.count({ where }),
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

export async function getPurchaseOrderById(id) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!po) {
    throw new AppError("Purchase order not found", 404);
  }

  return po;
}

function generatePONumber() {
  return `PO-${Date.now()}`;
}

export async function createPurchaseOrder(data) {
  const { supplierId, items } = data;

  // 1️⃣ Validate supplier
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  });

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  // 2️⃣ Validate products
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true },
  });

  if (products.length !== productIds.length) {
    throw new AppError("One or more products not found", 400);
  }

  // 3️⃣ Compute total cost
  const totalCost = items.reduce((sum, i) => sum + i.quantity * i.costPrice, 0);

  // 4️⃣ Create PO with items (transaction)
  return prisma.$transaction(async (tx) => {
    const po = await tx.purchaseOrder.create({
      data: {
        poNumber: generatePONumber(),
        supplierId,
        status: "DRAFT",
        totalCost,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            costPrice: i.costPrice,
          })),
        },
      },
      include: {
        items: true,
        supplier: true,
      },
    });

    return po;
  });
}

export async function updatePurchaseOrder(id, data) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!po) throw new AppError("PO not found", 404);

  if (po.status !== "DRAFT") {
    throw new AppError("Only DRAFT purchase orders can be updated", 400);
  }

  const totalCost = data.items.reduce(
    (sum, i) => sum + i.quantity * i.costPrice,
    0,
  );

  return prisma.$transaction(async (tx) => {
    await tx.purchaseOrderItem.deleteMany({
      where: { purchaseOrderId: id },
    });

    return tx.purchaseOrder.update({
      where: { id },
      data: {
        supplierId: data.supplierId,
        totalCost,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            costPrice: i.costPrice,
          })),
        },
      },
      include: {
        items: true,
        supplier: true,
      },
    });
  });
}

export async function markPurchaseOrderOrdered(id) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
  });

  if (!po) throw new AppError("PO not found", 404);

  if (po.status !== "DRAFT") {
    throw new AppError("Only DRAFT purchase orders can be ordered", 400);
  }

  return prisma.purchaseOrder.update({
    where: { id },
    data: { status: "ORDERED" },
  });
}

export async function receivePurchaseOrder(id) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!po) throw new AppError("PO not found", 404);

  if (po.status !== "ORDERED") {
    throw new AppError("Only ORDERED purchase orders can be received", 400);
  }

  return prisma.$transaction(async (tx) => {
    // 1️⃣ Create stock movements
    for (const item of po.items) {
      await createStockMovement({
        productId: item.productId,
        type: "IN",
        quantity: item.quantity,
        note: `PO ${po.poNumber} received`,
      });
    }

    // 2️⃣ Mark as RECEIVED
    return tx.purchaseOrder.update({
      where: { id },
      data: { status: "RECEIVED" },
    });
  });
}

export async function cancelPurchaseOrder(id) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
  });

  if (!po) throw new AppError("PO not found", 404);

  if (po.status === "RECEIVED") {
    throw new AppError("Received purchase orders cannot be cancelled", 400);
  }

  return prisma.purchaseOrder.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
}
