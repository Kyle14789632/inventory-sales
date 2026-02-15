import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema;
