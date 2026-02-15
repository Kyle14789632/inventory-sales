import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(50),

  name: z.string().min(1, "Product name is required").max(255),

  description: z.string().optional(),

  categoryId: z.string().uuid("Invalid category"),

  unit: z.enum(["pcs", "box", "kg"]),

  costPrice: z.number().nonnegative("Cost price must be >= 0"),

  sellingPrice: z.number().nonnegative("Selling price must be >= 0"),

  reorderLevel: z.number().int().nonnegative(),

  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = z.object({
  sku: z.string().min(1).max(50).optional(),

  name: z.string().min(1).max(255).optional(),

  description: z.string().optional().nullable(),

  categoryId: z.string().uuid("Invalid category").optional(),

  unit: z.enum(["pcs", "box", "kg"]).optional(),

  costPrice: z.number().nonnegative().optional(),

  sellingPrice: z.number().nonnegative().optional(),

  reorderLevel: z.number().int().nonnegative().optional(),

  isActive: z.boolean().optional(),
});

export const toggleProductStatusSchema = z.object({
  isActive: z.boolean(),
});
