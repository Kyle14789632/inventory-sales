import { z } from "zod";

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
        costPrice: z.coerce.number().positive(),
      }),
    )
    .min(1, "At least one item is required"),
});

export const updatePurchaseOrderSchema = createPurchaseOrderSchema;
