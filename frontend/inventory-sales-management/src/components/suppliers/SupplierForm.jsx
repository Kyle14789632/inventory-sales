import { TextInput, Textarea, Stack, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { supplierFormSchema } from "../../schemas/supplier.schema";

const DEFAULT_VALUES = {
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

export default function SupplierForm({
  initialValues,
  onSubmit,
  submitting,
  submitLabel = "Save supplier",
}) {
  const form = useForm({
    initialValues: DEFAULT_VALUES,
    validate: (values) => {
      const result = supplierFormSchema.safeParse(values);
      if (result.success) return {};

      const errors = {};
      const formatted = result.error.format();
      for (const key in formatted) {
        if (key !== "_errors" && formatted[key]?._errors?.length) {
          errors[key] = formatted[key]._errors[0];
        }
      }
      return errors;
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues({
        ...DEFAULT_VALUES,
        ...initialValues,
      });
    } else {
      form.setValues(DEFAULT_VALUES);
    }
  }, [initialValues]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Name" required {...form.getInputProps("name")} />
        <TextInput
          label="Contact person"
          {...form.getInputProps("contactPerson")}
        />
        <TextInput label="Phone" required {...form.getInputProps("phone")} />
        <TextInput label="Email" required {...form.getInputProps("email")} />
        <Textarea label="Address" required {...form.getInputProps("address")} />

        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
}
