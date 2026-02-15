import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createSupplierController,
  updateSupplierController,
  toggleSupplierStatusController,
  getSuppliersController,
  getSupplierByIdController,
  getSupplierOptionsController,
} from "./supplier.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", asyncHandler(createSupplierController));
router.get("/", asyncHandler(getSuppliersController));
router.get("/options", asyncHandler(getSupplierOptionsController));
router.get("/:id", asyncHandler(getSupplierByIdController));
router.put("/:id", asyncHandler(updateSupplierController));
router.patch("/:id/status", asyncHandler(toggleSupplierStatusController));

export default router;
