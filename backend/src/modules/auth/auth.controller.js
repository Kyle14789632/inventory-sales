import { login } from "./auth.service.js";
import AppError from "../../utils/AppError.js";

export async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(
      "Email and password are required",
      400,
      "VALIDATION_ERROR",
    );
  }

  const result = await login({ email, password });
  res.status(200).json(result);
}
