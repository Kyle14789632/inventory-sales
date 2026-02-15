import { logAudit } from "../auditLogs/auditLog.service.js";
import {
  createProductSchema,
  updateProductSchema,
  toggleProductStatusSchema,
} from "./product.schema.js";
import {
  getProductsPaginated,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
} from "./product.service.js";

export async function getProductsController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder || "asc";

  const result = await getProductsPaginated({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  res.json(result);
}

export async function getProductByIdController(req, res) {
  const { id } = req.params;

  const product = await getProductById(id);

  res.json(product);
}

export async function createProductController(req, res) {
  const parsed = createProductSchema.parse(req.body);

  const product = await createProduct(parsed);

  await logAudit({
    req,
    action: "CREATE",
    entity: "PRODUCT",
    entityId: product.id,
    description: `Created product ${product.name}`,
  });

  res.status(201).json(product);
}

export async function updateProductController(req, res) {
  const { id } = req.params;

  const parsed = updateProductSchema.parse(req.body);
  const product = await updateProduct(id, parsed);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "PRODUCT",
    entityId: product.id,
    description: `Updated product ${product.name}`,
  });

  res.json(product);
}

export async function toggleProductStatusController(req, res) {
  const { id } = req.params;
  const { isActive } = toggleProductStatusSchema.parse(req.body);

  const product = await toggleProductStatus(id, isActive);

  res.json(product);
}
