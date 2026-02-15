import { z } from "zod";

export const createStockMovementSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(["IN", "OUT"]),
  quantity: z.coerce.number().int().positive(),
  note: z.string().optional(),
});
