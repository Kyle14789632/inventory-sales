import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  cancelPurchaseOrderController,
  createPurchaseOrderController,
  getPurchaseOrderByIdController,
  getPurchaseOrdersController,
  markPurchaseOrderOrderedController,
  receivePurchaseOrderController,
  updatePurchaseOrderController,
} from "./purchaseOrder.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", asyncHandler(createPurchaseOrderController));

// Read
router.get("/", asyncHandler(getPurchaseOrdersController));

router.get("/:id", asyncHandler(getPurchaseOrderByIdController));

// Update (DRAFT only)
router.put("/:id", asyncHandler(updatePurchaseOrderController));

// Status transitions
router.patch("/:id/ordered", asyncHandler(markPurchaseOrderOrderedController));

router.patch("/:id/receive", asyncHandler(receivePurchaseOrderController));

router.patch("/:id/cancel", asyncHandler(cancelPurchaseOrderController));

export default router;
