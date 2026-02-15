import { Router } from "express";
import {
  createCategoryController,
  getCategoriesController,
  updateCategoryController,
  deleteCategoryController,
  getCategoryOptionsController,
} from "./category.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/rbac.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getCategoriesController));
router.get("/options", asyncHandler(getCategoryOptionsController));

router.post("/", requireRole("ADMIN"), asyncHandler(createCategoryController));
router.put(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(updateCategoryController),
);
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(deleteCategoryController),
);

export default router;
