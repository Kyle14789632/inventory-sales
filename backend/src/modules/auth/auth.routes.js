import { Router } from "express";
import { loginController } from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/login", asyncHandler(loginController));

export default router;
