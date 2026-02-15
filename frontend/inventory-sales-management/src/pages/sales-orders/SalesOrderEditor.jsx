import {
  Stack,
  Select,
  Button,
  Group,
  Text,
  Table,
  NumberInput,
  ActionIcon,
  Divider,
  Badge,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo } from "react";

const statusColor = {
  DRAFT: "gray",
  CONFIRMED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

export default function SalesOrderEditor({
  title,
  status,
  customerOptions,
  productOptions,
  customerId,
  setCustomerId,
  items,
  setItems,
  onSubmit,
  submitting,
  disabled,
  submitLabel,
}) {
  const addItem = () => {
    setItems((p) => [...p, { productId: null, quantity: 1, sellingPrice: 0 }]);
  };

  const updateItem = (i, field, value) => {
    setItems((p) =>
      p.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)),
    );
  };

  const removeItem = (i) => {
    setItems((p) => p.filter((_, idx) => idx !== i));
  };

  const totalAmount = useMemo(
    () => items.reduce((s, i) => s + i.quantity * i.sellingPrice, 0),
    [items],
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Text fw={600} size="lg">
          {title}
        </Text>
        <Badge color={statusColor[status]}>{status}</Badge>
      </Group>

      {disabled && (
        <Text size="sm" c="dimmed">
          This sales order is read-only because it is already {status}.
        </Text>
      )}

      <Select
        label="Customer"
        data={customerOptions}
        value={customerId}
        onChange={setCustomerId}
        disabled={disabled}
        required
      />

      <Divider />

      <Group justify="space-between">
        <Text fw={500}>Items</Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={addItem}
          disabled={disabled}
        >
          Add item
        </Button>
      </Group>

      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Qty</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {items.map((item, i) => (
            <Table.Tr key={i}>
              <Table.Td>
                <Select
                  data={productOptions}
                  value={item.productId}
                  onChange={(v) => updateItem(i, "productId", v)}
                  disabled={disabled}
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  min={1}
                  value={item.quantity}
                  onChange={(v) => updateItem(i, "quantity", v)}
                  disabled={disabled}
                />
              </Table.Td>
              <Table.Td>
                <NumberInput
                  min={0}
                  value={item.sellingPrice}
                  onChange={(v) => updateItem(i, "sellingPrice", v)}
                  disabled={disabled}
                />
              </Table.Td>
              <Table.Td>{item.quantity * item.sellingPrice}</Table.Td>
              <Table.Td>
                <ActionIcon
                  color="red"
                  onClick={() => removeItem(i)}
                  disabled={disabled}
                >
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
          loading={submitting}
          disabled={disabled || !customerId || items.length === 0}
          onClick={onSubmit}
        >
          {submitLabel}
        </Button>
      </Group>
    </Stack>
  );
}
