import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireRole } from "../../middleware/rbac.middleware.js";
import { getAuditLogsController } from "./auditLog.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", requireRole("ADMIN"), asyncHandler(getAuditLogsController));

export default router;
