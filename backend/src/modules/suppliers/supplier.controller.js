import { logAudit } from "../auditLogs/auditLog.service.js";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "./supplier.schema.js";
import {
  createSupplier,
  updateSupplier,
  toggleSupplierStatus,
  getSuppliers,
  getSupplierById,
  getSupplierOptions,
} from "./supplier.service.js";

export async function getSuppliersController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "name";
  const sortOrder = req.query.sortOrder || "asc";

  const result = await getSuppliers({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  res.json(result);
}

export async function getSupplierByIdController(req, res) {
  const supplier = await getSupplierById(req.params.id);
  res.json(supplier);
}

export async function getSupplierOptionsController(req, res) {
  const suppliers = await getSupplierOptions();
  res.json(suppliers);
}

export async function createSupplierController(req, res) {
  const parsed = createSupplierSchema.parse(req.body);
  const supplier = await createSupplier(parsed);

  await logAudit({
    req,
    action: "CREATE",
    entity: "SUPPLIER",
    entityId: supplier.id,
    description: `Created supplier ${supplier.name}`,
  });

  res.status(201).json(supplier);
}

export async function updateSupplierController(req, res) {
  const parsed = updateSupplierSchema.parse(req.body);
  const supplier = await updateSupplier(req.params.id, parsed);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "SUPPLIER",
    entityId: supplier.id,
    description: `Updated supplier ${supplier.name}`,
  });

  res.json(supplier);
}

export async function toggleSupplierStatusController(req, res) {
  const { isActive } = req.body;
  const supplier = await toggleSupplierStatus(req.params.id, isActive);
  res.json(supplier);
}
