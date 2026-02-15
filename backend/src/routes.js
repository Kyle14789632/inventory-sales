import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import purchaseOrderRoutes from "./modules/purchase-orders/purchaseOrder.routes.js";
import supplierRoutes from "./modules/suppliers/supplier.routes.js";
import salesOrderRoutes from "./modules/sales-orders/salesOrder.routes.js";
import customerRoutes from "./modules/customers/customer.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";
import auditLogRoutes from "./modules/auditLogs/auditLog.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/purchase-orders", purchaseOrderRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/sales-orders", salesOrderRoutes);
router.use("/customers", customerRoutes);
router.use("/reports", reportRoutes);
router.use("/audit-logs", auditLogRoutes);

export default router;
