import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";
import AppError from "../../utils/AppError.js";

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
