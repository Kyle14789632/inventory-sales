import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  createUserController,
  getUsersController,
  toggleUserStatusController,
} from "./user.controller.js";
import { requireRole } from "../../middleware/rbac.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", requireRole("ADMIN"), asyncHandler(getUsersController));

router.post("/", requireRole("ADMIN"), asyncHandler(createUserController));

router.patch(
  "/:id/status",
  requireRole("ADMIN"),
  asyncHandler(toggleUserStatusController),
);

export default router;
