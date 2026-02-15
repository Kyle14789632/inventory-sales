import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createCustomerController,
  getCustomersController,
  updateCustomerController,
  toggleCustomerStatusController,
  getCustomerOptionsController,
} from "./customer.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", asyncHandler(createCustomerController));
router.get("/", asyncHandler(getCustomersController));
router.get("/options", asyncHandler(getCustomerOptionsController));
router.put("/:id", asyncHandler(updateCustomerController));
router.patch("/:id/status", asyncHandler(toggleCustomerStatusController));

export default router;
