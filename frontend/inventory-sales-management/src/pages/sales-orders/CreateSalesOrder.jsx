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
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerOptions } from "../../services/customer.service";
import { fetchProductOptions } from "../../services/product.service";
import { useSalesOrderCreate } from "../../hooks/sales-orders/useSalesOrderCreate";

export default function CreateSalesOrder() {
  const navigate = useNavigate();
  const createMutation = useSalesOrderCreate();

  const [customerId, setCustomerId] = useState(null);
  const [items, setItems] = useState([]);

  const { data: customers = [] } = useQuery({
    queryKey: ["customer-options"],
    queryFn: fetchCustomerOptions,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["product-options"],
    queryFn: fetchProductOptions,
  });

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const productOptions = products.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const addItem = () => {
    setItems((p) => [...p, { productId: null, quantity: 1, sellingPrice: 0 }]);
  };

  const updateItem = (index, field, value) => {
    setItems((p) =>
      p.map((i, idx) => (idx === index ? { ...i, [field]: value } : i)),
    );
  };

  const removeItem = (index) => {
    setItems((p) => p.filter((_, idx) => idx !== index));
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity * i.sellingPrice, 0);
  }, [items]);
  const hasNoCustomer = !customerId;
  const hasNoItems = items.length === 0;
  const hasUnselectedItem = items.some((item) => !item.productId);
  const isSaveDraftDisabled = hasNoCustomer || hasNoItems || hasUnselectedItem;

  const submit = () => {
    if (!customerId || items.length === 0) return;

    createMutation.mutate({
      customerId,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
        sellingPrice: Number(i.sellingPrice),
      })),
    });

    navigate("/sales-orders");
  };

  return (
    <Stack>
      <Text fw={600} size="lg">
        Create Sales Order
      </Text>

      <Select
        label="Customer"
        data={customerOptions}
        value={customerId}
        onChange={setCustomerId}
        required
      />

      <Divider />

      <Group justify="space-between">
        <Text fw={500}>Items</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={addItem}>
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
          {items.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Select
                  data={productOptions}
                  value={item.productId}
                  onChange={(v) => updateItem(index, "productId", v)}
                />
              </Table.Td>

              <Table.Td>
                <NumberInput
                  min={1}
                  value={item.quantity}
                  onChange={(v) => updateItem(index, "quantity", v)}
                />
              </Table.Td>

              <Table.Td>
                <NumberInput
                  min={0}
                  value={item.sellingPrice}
                  onChange={(v) => updateItem(index, "sellingPrice", v)}
                />
              </Table.Td>

              <Table.Td>{item.quantity * item.sellingPrice}</Table.Td>

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
          loading={createMutation.isPending}
          disabled={isSaveDraftDisabled}
          onClick={submit}
        >
          Save Draft
        </Button>
      </Group>
    </Stack>
  );
}
