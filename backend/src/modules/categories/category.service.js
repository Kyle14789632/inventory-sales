import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";

export async function getCategoriesPaginated({
  page,
  limit,
  search,
  sortBy = "name",
  sortOrder = "asc",
}) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const orderBy = {
    [sortBy]: sortOrder,
  };

  const [data, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.category.count({ where }),
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

export async function getCategoryById(id) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError("Category not found", 404);
  return category;
}

export async function getCategoryOptions() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function createCategory(data) {
  const exists = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (exists) {
    throw new AppError("Category already exists", 409, "DUPLICATE_ENTRY");
  }

  return prisma.category.create({ data });
}

export async function updateCategory(id, data) {
  await getCategoryById(id);

  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id) {
  const category = await getCategoryById(id);

  try {
    await prisma.category.delete({
      where: { id },
    });

    return category;
  } catch {
    throw new AppError("Category is in use", 409, "RESOURCE_IN_USE");
  }
}
