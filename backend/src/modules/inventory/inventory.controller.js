import { logAudit } from "../auditLogs/auditLog.service.js";
import { createStockMovementSchema } from "./inventory.schema.js";
import {
  createStockMovement,
  getProductStock,
  getStockMovements,
  getStockSummary,
} from "./inventory.service.js";

export async function getStockSummaryController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder || "asc";

  const result = await getStockSummary({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  res.json(result);
}

export async function getProductStockController(req, res) {
  const { productId } = req.params;

  const stock = await getProductStock(productId);

  res.json(stock);
}

export async function getStockMovementsController(req, res) {
  const { productId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getStockMovements({
    productId,
    page,
    limit,
  });

  res.json(result);
}

export async function createStockMovementController(req, res) {
  const parsed = createStockMovementSchema.parse(req.body);

  const movement = await createStockMovement(parsed);

  console.log(movement);

  await logAudit({
    req,
    action: "CREATE",
    entity: "STOCK_MOVEMENT",
    entityId: movement.id,
    description: `Created stock movement (${movement.type}) for product ${movement.productId} with quantity ${movement.quantity}`,
  });

  res.status(201).json(movement);
}
