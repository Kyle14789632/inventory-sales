import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createSalesOrderController,
  getSalesOrdersController,
  getSalesOrderByIdController,
  updateSalesOrderController,
  confirmSalesOrderController,
  completeSalesOrderController,
  cancelSalesOrderController,
} from "./salesOrder.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", asyncHandler(createSalesOrderController));
router.get("/", asyncHandler(getSalesOrdersController));
router.get("/:id", asyncHandler(getSalesOrderByIdController));
router.put("/:id", asyncHandler(updateSalesOrderController));
router.patch("/:id/confirm", asyncHandler(confirmSalesOrderController));
router.patch("/:id/complete", asyncHandler(completeSalesOrderController));
router.patch("/:id/cancel", asyncHandler(cancelSalesOrderController));

export default router;
