import {
  Table,
  Group,
  Button,
  Text,
  ActionIcon,
  Badge,
  Pagination,
  Center,
  TextInput,
} from "@mantine/core";
import {
  IconSearch,
  IconEye,
  IconTrash,
  IconPencil,
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePurchaseOrders } from "../../hooks/purchase-orders/usePurchaseOrders";
import { usePurchaseOrderStatus } from "../../hooks/purchase-orders/usePurchaseOrderStatus";
import { useDebounce } from "../../hooks/useDebounce";
import { modals } from "@mantine/modals";
import TableLoading from "../../components/TableLoading";
import EmptyState from "../../components/EmptyState";

const statusColor = {
  DRAFT: "gray",
  ORDERED: "blue",
  RECEIVED: "green",
  CANCELLED: "red",
};

export default function PurchaseOrders() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching } = usePurchaseOrders({
    page,
    limit,
    search: debouncedSearch,
  });

  const { orderMutation, receiveMutation, cancelMutation } =
    usePurchaseOrderStatus();

  const orders = data?.data || [];
  const meta = data?.meta;
  const isSearching = Boolean(search);
  const showLoading = isLoading || isFetching;

  const updateParams = (params) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      Object.entries(params).forEach(([k, v]) => {
        if (!v) p.delete(k);
        else p.set(k, v);
      });
      return p;
    });
  };

  const markAsOrdered = (orderId) => {
    modals.openConfirmModal({
      title: "Cancel Purchase Order",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to mark this purchase order as ordered?
        </Text>
      ),
      labels: { confirm: "Mark as Ordered", cancel: "Cancel" },
      confirmProps: { color: "blue" },
      onConfirm: () => orderMutation.mutate(orderId),
    });
  };

  const receiveOrder = (orderId) => {
    modals.openConfirmModal({
      title: "Cancel Purchase Order",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to receive this purhcase order?
        </Text>
      ),
      labels: { confirm: "Receive Order", cancel: "Cancel" },
      confirmProps: { color: "green" },
      onConfirm: () => receiveMutation.mutate(orderId),
    });
  };

  const confirmCancel = (orderId) => {
    modals.openConfirmModal({
      title: "Cancel Purchase Order",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to cancel this purchase order?
        </Text>
      ),
      labels: { confirm: "Cancel", cancel: "Back" },
      confirmProps: { color: "red" },
      onConfirm: () => cancelMutation.mutate(orderId),
    });
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Purchase Orders
        </Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/purchase-orders/create")}
        >
          Create PO
        </Button>
      </Group>

      <TextInput
        placeholder="Search purchase orders..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
        mb="md"
      />

      {showLoading ? (
        <TableLoading message="Loading purchase orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title={
            isSearching
              ? "No matching purchase orders"
              : "No purchase orders found"
          }
          description={
            isSearching
              ? "Try a different search term."
              : "You haven't created any purchase orders yet."
          }
        />
      ) : (
        <>
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>PO Number</Table.Th>
                <Table.Th>Supplier</Table.Th>
                <Table.Th>Order Date</Table.Th>
                <Table.Th>Total Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {orders.map((order) => {
                return (
                  <Table.Tr key={order.id}>
                    <Table.Td>{order.poNumber}</Table.Td>
                    <Table.Td>{order.supplier?.name || "-"}</Table.Td>
                    <Table.Td>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td>{order.totalCost}</Table.Td>
                    <Table.Td>
                      <Badge color={statusColor[order.status]}>
                        {order.status}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        // onClick={() => setSelected(order)}
                        aria-label="Edit purchase order"
                        onClick={() =>
                          navigate(`/purchase-orders/${order.id}/edit`)
                        }
                      >
                        {order.status === "DRAFT" ? (
                          <IconPencil size={16} />
                        ) : (
                          <IconEye size={16} />
                        )}
                      </ActionIcon>
                      {order.status === "DRAFT" && (
                        <ActionIcon
                          variant="subtle"
                          onClick={() => markAsOrdered(order.id)}
                          aria-label="Mark as Ordered"
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                      )}
                      {order.status === "ORDERED" && (
                        <ActionIcon
                          variant="subtle"
                          onClick={() => receiveOrder(order.id)}
                          aria-label="Receive Order"
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                      )}
                      {(order.status === "DRAFT" ||
                        order.status === "ORDERED") && (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => confirmCancel(order.id)}
                          aria-label="Cancel"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>

          {meta?.totalPages > 1 && (
            <Center mt="md">
              <Pagination
                value={page}
                onChange={(p) => updateParams({ page: p })}
                total={meta.totalPages}
              />
            </Center>
          )}
        </>
      )}
    </>
  );
}
