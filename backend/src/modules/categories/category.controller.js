import {
  createCategory,
  getCategoriesPaginated,
  updateCategory,
  deleteCategory,
  getCategoryOptions,
} from "./category.service.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";
import { logAudit } from "../auditLogs/auditLog.service.js";

export async function getCategoriesController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder || "asc";

  const result = await getCategoriesPaginated({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  res.json(result);
}

export async function getCategoryOptionsController(req, res) {
  const categories = await getCategoryOptions();
  res.json(categories);
}

export async function createCategoryController(req, res) {
  const payload = createCategorySchema.parse(req.body);
  const category = await createCategory(payload);

  await logAudit({
    req,
    action: "CREATE",
    entity: "CATEGORY",
    entityId: category.id,
    description: `Created category ${category.name}`,
  });

  res.status(201).json(category);
}

export async function updateCategoryController(req, res) {
  const payload = updateCategorySchema.parse(req.body);
  const category = await updateCategory(req.params.id, payload);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "CATEGORY",
    entityId: category.id,
    description: `Updated category ${category.name}`,
  });

  res.json(category);
}

export async function deleteCategoryController(req, res) {
  const category = await deleteCategory(req.params.id);

  await logAudit({
    req,
    action: "DELETE",
    entity: "CATEGORY",
    entityId: category.id,
    description: `Deleted category ${category.name}`,
  });

  res.status(204).send();
}
