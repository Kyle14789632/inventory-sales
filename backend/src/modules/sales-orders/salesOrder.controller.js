import { logAudit } from "../auditLogs/auditLog.service.js";
import {
  createSalesOrderSchema,
  updateSalesOrderSchema,
} from "./salesOrder.schema.js";

import {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  confirmSalesOrder,
  completeSalesOrder,
  cancelSalesOrder,
} from "./salesOrder.service.js";

export async function getSalesOrdersController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const result = await getSalesOrders({ page, limit, search });
  res.json(result);
}

export async function getSalesOrderByIdController(req, res) {
  const so = await getSalesOrderById(req.params.id);
  res.json(so);
}

export async function createSalesOrderController(req, res) {
  const payload = createSalesOrderSchema.parse(req.body);
  const so = await createSalesOrder(payload);

  await logAudit({
    req,
    action: "CREATE",
    entity: "SALES_ORDER",
    entityId: so.id,
    description: `Created sales order ${so.soNumber}`,
  });

  res.status(201).json(so);
}

export async function updateSalesOrderController(req, res) {
  const payload = updateSalesOrderSchema.parse(req.body);
  const so = await updateSalesOrder(req.params.id, payload);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "SALES_ORDER",
    entityId: so.id,
    description: `Updated sales order ${so.soNumber}`,
  });

  res.json(so);
}

export async function confirmSalesOrderController(req, res) {
  const so = await confirmSalesOrder(req.params.id);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "SALES_ORDER",
    entityId: so.id,
    description: `Confirmed sales order ${so.soNumber}`,
  });
  res.json(so);
}

export async function completeSalesOrderController(req, res) {
  const so = await completeSalesOrder(req.params.id);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "SALES_ORDER",
    entityId: so.id,
    description: `Completed sales order ${so.soNumber}`,
  });

  res.json(so);
}

export async function cancelSalesOrderController(req, res) {
  const so = await cancelSalesOrder(req.params.id);

  await logAudit({
    req,
    action: "CANCEL",
    entity: "SALES_ORDER",
    entityId: so.id,
    description: `Cancelled sales order ${so.soNumber}`,
  });

  res.json(so);
}
