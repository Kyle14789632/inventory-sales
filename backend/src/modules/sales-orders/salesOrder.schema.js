import { z } from "zod";

export const createSalesOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
        sellingPrice: z.coerce.number().positive(),
      }),
    )
    .min(1, "At least one item is required"),
});

export const updateSalesOrderSchema = createSalesOrderSchema;
