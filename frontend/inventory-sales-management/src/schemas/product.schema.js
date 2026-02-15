import { z } from "zod";

export const productFormSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().uuid("Category is required"),
  unit: z.enum(["pcs", "box", "kg"]),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  reorderLevel: z.number().int().min(0),
  isActive: z.boolean().optional(),
});
