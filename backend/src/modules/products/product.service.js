import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";

export async function getProductsPaginated({
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
      : {}),
  };

  const orderBy = {
    [sortBy]: sortOrder,
  };

  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
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

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
}

export async function createProduct(data) {
  // 1️⃣ Check SKU uniqueness
  const existingSku = await prisma.product.findUnique({
    where: { sku: data.sku },
  });

  if (existingSku) {
    throw new AppError("SKU already exists", 409);
  }

  // 2️⃣ Ensure category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // 3️⃣ Create product
  return prisma.product.create({
    data,
  });
}

export async function updateProduct(id, data) {
  // 1️⃣ Ensure product exists
  const existing = await prisma.product.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError("Product not found", 404);
  }

  // 2️⃣ SKU uniqueness (if SKU is changing)
  if (data.sku && data.sku !== existing.sku) {
    const skuExists = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (skuExists) {
      throw new AppError("SKU already exists", 409);
    }
  }

  // 3️⃣ Category existence (if changing)
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  // 4️⃣ Update product
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function toggleProductStatus(id, isActive) {
  const existing = await prisma.product.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError("Product not found", 404);
  }

  return prisma.product.update({
    where: { id },
    data: { isActive },
  });
}
