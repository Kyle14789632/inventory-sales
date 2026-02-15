import { logAudit } from "../auditLogs/auditLog.service.js";
import {
  cancelPurchaseOrder,
  createPurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
  markPurchaseOrderOrdered,
  receivePurchaseOrder,
  updatePurchaseOrder,
} from "./pruchaseOrder.service.js";
import {
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
} from "./purchaseOrder.schema.js";

export async function getPurchaseOrdersController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const result = await getPurchaseOrders({
    page,
    limit,
    search,
  });

  res.json(result);
}

export async function getPurchaseOrderByIdController(req, res) {
  const { id } = req.params;

  const po = await getPurchaseOrderById(id);

  res.json(po);
}

export async function createPurchaseOrderController(req, res) {
  const parsed = createPurchaseOrderSchema.parse(req.body);

  const po = await createPurchaseOrder(parsed);

  await logAudit({
    req,
    action: "CREATE",
    entity: "PURCHASE_ORDER",
    entityId: po.id,
    description: `Created purchase order ${po.poNumber}`,
  });

  res.status(201).json(po);
}

export async function updatePurchaseOrderController(req, res) {
  const { id } = req.params;
  const payload = updatePurchaseOrderSchema.parse(req.body);

  const po = await updatePurchaseOrder(id, payload);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "PURCHASE_ORDER",
    entityId: po.id,
    description: `Updated purchase order ${po.poNumber}`,
  });

  res.json(po);
}

export async function markPurchaseOrderOrderedController(req, res) {
  const { id } = req.params;

  const po = await markPurchaseOrderOrdered(id);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "PURCHASE_ORDER",
    entityId: po.id,
    description: `Marked purchase order ${po.poNumber} as ordered`,
  });

  res.json(po);
}

export async function receivePurchaseOrderController(req, res) {
  const { id } = req.params;

  const po = await receivePurchaseOrder(id);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "PURCHASE_ORDER",
    entityId: po.id,
    description: `Received purchase order ${po.poNumber}`,
  });

  res.json(po);
}

export async function cancelPurchaseOrderController(req, res) {
  const { id } = req.params;

  const po = await cancelPurchaseOrder(id);

  await logAudit({
    req,
    action: "CANCEL",
    entity: "PURCHASE_ORDER",
    entityId: po.id,
    description: `Cancelled purchase order ${po.poNumber}`,
  });

  res.json(po);
}
