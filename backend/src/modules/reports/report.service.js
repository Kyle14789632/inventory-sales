import prisma from "../../prisma/client.js";

export async function getLowStockProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      reorderLevel: true,
      stockMovements: {
        select: { type: true, quantity: true },
      },
    },
  });

  return products
    .map((p) => {
      const stock = p.stockMovements.reduce(
        (sum, m) => (m.type === "IN" ? sum + m.quantity : sum - m.quantity),
        0,
      );
      return { ...p, stock };
    })
    .filter((p) => p.stock <= p.reorderLevel);
}

export async function getSalesSummary() {
  const now = new Date();

  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );

  const [daily, weekly, monthly] = await Promise.all([
    prisma.salesOrder.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        orderDate: { gte: startOfDay },
      },
    }),
    prisma.salesOrder.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        orderDate: { gte: startOfWeek },
      },
    }),
    prisma.salesOrder.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        orderDate: { gte: startOfMonth },
      },
    }),
  ]);

  return {
    daily: daily._sum.totalAmount || 0,
    weekly: weekly._sum.totalAmount || 0,
    monthly: monthly._sum.totalAmount || 0,
  };
}

export async function getTopSellingProducts(limit = 5) {
  const items = await prisma.salesOrderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: {
      _sum: { quantity: "desc" },
    },
    take: limit,
  });

  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((i) => i.productId) },
    },
    select: { id: true, name: true },
  });

  return items.map((i) => ({
    product: products.find((p) => p.id === i.productId),
    quantitySold: i._sum.quantity,
  }));
}
