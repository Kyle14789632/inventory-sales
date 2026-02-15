import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createStockMovementController,
  getProductStockController,
  getStockMovementsController,
  getStockSummaryController,
} from "./inventory.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

// mutations
router.post("/movements", asyncHandler(createStockMovementController));

// queries
router.get("/movements/:productId", asyncHandler(getStockMovementsController));

router.get("/stock", asyncHandler(getStockSummaryController));

router.get("/stock/:productId", asyncHandler(getProductStockController));

export default router;
