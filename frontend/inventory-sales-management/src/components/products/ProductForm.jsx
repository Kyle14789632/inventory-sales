import {
  TextInput,
  NumberInput,
  Button,
  Stack,
  Group,
  Select,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  costPrice: z.number().min(0, "Cost must be positive"),
  sellingPrice: z.number().min(0, "Price must be positive"),
  reorderLevel: z.number().min(0, "Reorder level must be positive"),
});

export default function ProductForm({
  categories = [],
  initialValues,
  submitting,
  onSubmit,
}) {
  const form = useForm({
    initialValues,
    validate: zodResolver(schema),
  });

  const categoryOptions = categories?.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="Product name" required {...form.getInputProps("name")} />

        <TextInput label="SKU" required {...form.getInputProps("sku")} />

        <Textarea label="Description" {...form.getInputProps("description")} />

        <Group grow>
          <NumberInput
            label="Cost Price"
            min={0}
            step={0.01}
            required
            {...form.getInputProps("costPrice")}
          />
          <NumberInput
            label="Selling Price"
            min={0}
            step={0.01}
            required
            {...form.getInputProps("sellingPrice")}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Reorder level"
            min={0}
            required
            {...form.getInputProps("reorderLevel")}
          />
          <TextInput label="Unit" required {...form.getInputProps("unit")} />
        </Group>

        <Select
          label="Category"
          data={categoryOptions}
          required
          {...form.getInputProps("categoryId")}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={submitting}>
            {initialValues?.id ? "Update" : "Create"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
