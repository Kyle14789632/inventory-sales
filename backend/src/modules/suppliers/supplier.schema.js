import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1),
  contactPerson: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
});

export const updateSupplierSchema = createSupplierSchema.partial();
