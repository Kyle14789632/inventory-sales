import AppError from "../utils/AppError.js";

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log(req.user);
      return next(new AppError("Forbidden", 403, "FORBIDDEN"));
    }
    next();
  };
}
