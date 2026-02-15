import {
  ActionIcon,
  Button,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { usePurchaseOrderCreate } from "../../hooks/purchase-orders/usePurchaseOrderCreate";
import { useMemo, useState } from "react";
import { fetchSupplierOptions } from "../../services/supplier.service";
import { useQuery } from "@tanstack/react-query";
import { fetchProductOptions } from "../../services/product.service";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const createMutation = usePurchaseOrderCreate();

  const { data: suppliers = [] } = useQuery({
    queryKey: ["supplier-options"],
    queryFn: fetchSupplierOptions,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["product-options"],
    queryFn: fetchProductOptions,
  });

  const supplierOptions = suppliers.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const productOptions = products.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const [form, setForm] = useState({
    supplierId: null,
    items: [],
    notes: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;
    setForm((prev) => ({ ...prev, items }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: null, quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const totalAmount = useMemo(
    () => form.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [form.items],
  );
  const hasNoSupplier = !form.supplierId;
  const hasNoItems = form.items.length === 0;
  const hasUnselectedItem = form.items.some((item) => !item.productId);
  const isSaveDraftDisabled = hasNoSupplier || hasNoItems || hasUnselectedItem;

  const handleSubmit = () => {
    if (!form.supplierId || form.items.length === 0) return;

    createMutation.mutate(
      {
        supplierId: form.supplierId,
        notes: form.notes,
        items: form.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          costPrice: Number(item.price),
        })),
      },
      {
        onSuccess: () => navigate("/purchase-orders"),
      },
    );
  };

  return (
    <Stack>
      <Text fw={600} size="lg">
        Create Purchase Order
      </Text>

      <Select
        label="Supplier"
        data={supplierOptions}
        value={form.supplierId}
        onChange={(value) => handleChange("supplierId", value)}
        required
      />

      <Divider />

      <Group justify="space-between">
        <Text fw={500}>Items</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={addItem}>
          Add Item
        </Button>
      </Group>

      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Qty</Table.Th>
            <Table.Th>Cost</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {form.items.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Select
                  data={productOptions}
                  value={item.productId}
                  onChange={(value) =>
                    handleItemChange(index, "productId", value)
                  }
                />
              </Table.Td>

              <Table.Td>
                <NumberInput
                  min={1}
                  value={item.quantity}
                  onChange={(value) =>
                    handleItemChange(index, "quantity", value)
                  }
                />
              </Table.Td>

              <Table.Td>
                <NumberInput
                  min={0}
                  value={item.price}
                  onChange={(value) => handleItemChange(index, "price", value)}
                />
              </Table.Td>

              <Table.Td>{item.quantity * item.price}</Table.Td>

              <Table.Td>
                <ActionIcon color="red" onClick={() => removeItem(index)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="space-between">
        <Text fw={600}>Total: {totalAmount}</Text>
        <Button
          onClick={handleSubmit}
          loading={createMutation.isPending}
          disabled={isSaveDraftDisabled}
        >
          Save Draft
        </Button>
      </Group>
    </Stack>
  );
}
