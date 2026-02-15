import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Payload:", payload);
    req.user = payload;
    next();
  } catch {
    next(new AppError("Invalid token", 401, "INVALID_TOKEN"));
  }
}
