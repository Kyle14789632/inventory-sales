import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";

export async function getStockSummary({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            sku: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  // 1️⃣ Get products (paginated)
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        reorderLevel: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const productIds = products.map((p) => p.id);

  // 2️⃣ Aggregate stock per product
  const movements = await prisma.stockMovement.groupBy({
    by: ["productId"],
    where: {
      productId: { in: productIds },
    },
    _sum: {
      quantity: true,
    },
  });

  // 3️⃣ Map stock to products
  const stockMap = new Map(
    movements.map((m) => [m.productId, m._sum.quantity || 0]),
  );

  const data = products.map((p) => ({
    ...p,
    currentStock: stockMap.get(p.id) || 0,
    isLowStock:
      stockMap.get(p.id) !== undefined
        ? stockMap.get(p.id) < p.reorderLevel
        : p.reorderLevel > 0,
  }));

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

export async function getProductStock(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      sku: true,
      reorderLevel: true,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const stock = await getCurrentStock(productId);

  return {
    ...product,
    currentStock: stock,
    isLowStock: stock < product.reorderLevel,
  };
}

export async function getStockMovements({ productId, page, limit }) {
  const skip = (page - 1) * limit;

  // 1️⃣ Ensure product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // 2️⃣ Fetch movements + count
  const [movements, total] = await prisma.$transaction([
    prisma.stockMovement.findMany({
      where: { productId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        quantity: true,
        note: true,
        createdAt: true,
      },
    }),
    prisma.stockMovement.count({
      where: { productId },
    }),
  ]);

  return {
    data: movements,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Calculate current stock for a product
 */
export async function getCurrentStock(productId) {
  const result = await prisma.stockMovement.aggregate({
    where: { productId },
    _sum: {
      quantity: true,
    },
  });

  // IN movements are positive, OUT are stored as negative
  return result._sum.quantity || 0;
}

export async function createStockMovement(data) {
  const { productId, type, quantity, note } = data;

  // 1️⃣ Ensure product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // 2️⃣ Compute current stock
  const currentStock = await getCurrentStock(productId);

  // 3️⃣ Convert quantity based on type
  const signedQty = type === "OUT" ? -quantity : quantity;

  // 4️⃣ Prevent negative stock
  if (type === "OUT" && currentStock + signedQty < 0) {
    throw new AppError(`Insufficient stock. Available: ${currentStock}`, 400);
  }

  // 5️⃣ Create movement
  return prisma.stockMovement.create({
    data: {
      productId,
      quantity: signedQty,
      type,
      note,
    },
  });
}
