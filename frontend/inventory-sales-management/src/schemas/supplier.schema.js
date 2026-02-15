import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
});
