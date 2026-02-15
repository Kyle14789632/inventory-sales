import AppError from "../utils/AppError.js";

export function errorHandler(err, req, res, next) {
  console.error(err);

  // Known, expected errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  // Prisma unique constraint
  if (err.code === "P2002") {
    return res.status(409).json({
      message: "Duplicate entry",
      code: "DUPLICATE_ENTRY",
    });
  }

  // Fallback – unknown / programming error
  return res.status(500).json({
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
