import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { dashboardReportController } from "./report.controller.js";

const router = express.Router();

router.get("/dashboard", asyncHandler(dashboardReportController));

export default router;
