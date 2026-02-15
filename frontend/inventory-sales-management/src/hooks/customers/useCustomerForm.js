import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
});

export function useCustomerForm(initialValues) {
  return useForm({
    initialValues,
    validate: zodResolver(schema),
  });
}
