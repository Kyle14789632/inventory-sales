import { logAudit } from "../auditLogs/auditLog.service.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.schema.js";

import {
  createCustomer,
  getCustomers,
  updateCustomer,
  toggleCustomerStatus,
  getCustomerOptions,
} from "./customer.service.js";

export async function getCustomersController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder || "asc";

  const result = await getCustomers({ page, limit, search, sortBy, sortOrder });
  res.json(result);
}

export async function getCustomerOptionsController(req, res) {
  const customers = await getCustomerOptions();
  res.json(customers);
}

export async function createCustomerController(req, res) {
  const payload = createCustomerSchema.parse(req.body);
  const customer = await createCustomer(payload);

  await logAudit({
    req,
    action: "CREATE",
    entity: "CUSTOMER",
    entityId: customer.id,
    description: `Created customer ${customer.name}`,
  });

  res.status(201).json(customer);
}

export async function updateCustomerController(req, res) {
  const payload = updateCustomerSchema.parse(req.body);
  const customer = await updateCustomer(req.params.id, payload);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "CUSTOMER",
    entityId: customer.id,
    description: `Updated customer ${customer.name}`,
  });

  res.json(customer);
}

export async function toggleCustomerStatusController(req, res) {
  const { isActive } = req.body;
  const customer = await toggleCustomerStatus(req.params.id, isActive);
  res.json(customer);
}
