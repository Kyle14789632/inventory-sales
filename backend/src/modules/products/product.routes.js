import express from "express";
import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  toggleProductStatusController,
} from "./product.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", asyncHandler(getProductsController));
router.get("/:id", asyncHandler(getProductByIdController));

router.post("/", asyncHandler(createProductController));
router.put("/:id", asyncHandler(updateProductController));
router.patch("/:id/status", asyncHandler(toggleProductStatusController));

export default router;
