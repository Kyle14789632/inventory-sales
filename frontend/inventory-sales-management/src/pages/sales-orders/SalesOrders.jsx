import {
  Table,
  Group,
  Text,
  TextInput,
  Pagination,
  Center,
  Badge,
  Button,
  ActionIcon,
} from "@mantine/core";
import {
  IconCheck,
  IconCircleCheck,
  IconEdit,
  IconEye,
  IconPencil,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSalesOrders } from "../../hooks/sales-orders/useSalesOrders";
import { useDebounce } from "../../hooks/useDebounce";
import TableLoading from "../../components/TableLoading";
import EmptyState from "../../components/EmptyState";
import { useSalesOrderStatus } from "../../hooks/sales-orders/useSalesOrderStatus";
import { modals } from "@mantine/modals";

const statusColor = {
  DRAFT: "gray",
  CONFIRMED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

export default function SalesOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching } = useSalesOrders({
    page,
    limit,
    search: debouncedSearch,
  });

  const { confirmMutation, completeMutation, cancelMutation } =
    useSalesOrderStatus();

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

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Sales Orders
        </Text>

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/sales-orders/create")}
        >
          Create SO
        </Button>
      </Group>

      <TextInput
        placeholder="Search SO number..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
        mb="md"
      />
      {showLoading ? (
        <TableLoading message="Loading sales orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title={
            isSearching ? "No matching sales orders" : "No sales orders found"
          }
          description={
            isSearching
              ? "Try a different search term."
              : "You haven’t created any sales orders yet."
          }
        />
      ) : (
        <>
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>SO Number</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Order Date</Table.Th>
                <Table.Th>Total Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th w={110}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {orders.map((so) => (
                <Table.Tr>
                  <Table.Td>{so.soNumber}</Table.Td>
                  <Table.Td>{so.customer.name}</Table.Td>
                  <Table.Td>
                    {new Date(so.orderDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>{so.totalAmount}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[so.status]}>{so.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    {/* VIEW / EDIT */}
                    <ActionIcon
                      variant="subtle"
                      onClick={() => navigate(`/sales-orders/${so.id}/edit`)}
                    >
                      {so.status === "DRAFT" ? (
                        <IconPencil size={16} />
                      ) : (
                        <IconEye size={16} />
                      )}
                    </ActionIcon>

                    {/* CONFIRM */}
                    {so.status === "DRAFT" && (
                      <ActionIcon
                        color="blue"
                        variant="subtle"
                        onClick={() =>
                          modals.openConfirmModal({
                            title: "Confirm Sales Order",
                            centered: true,
                            children: (
                              <Text size="sm">
                                This will deduct stock from inventory. This
                                action cannot be undone.
                              </Text>
                            ),
                            labels: {
                              confirm: "Confirm",
                              cancel: "Cancel",
                            },
                            confirmProps: { color: "blue" },
                            onConfirm: () => confirmMutation.mutate(so.id),
                          })
                        }
                      >
                        <IconCheck size={16} />
                      </ActionIcon>
                    )}

                    {/* COMPLETE */}
                    {so.status === "CONFIRMED" && (
                      <ActionIcon
                        color="green"
                        variant="subtle"
                        onClick={() =>
                          modals.openConfirmModal({
                            title: "Complete Sales Order",
                            centered: true,
                            children: (
                              <Text size="sm">
                                Mark this sales order as completed?
                              </Text>
                            ),
                            labels: {
                              confirm: "Complete",
                              cancel: "Cancel",
                            },
                            confirmProps: { color: "green" },
                            onConfirm: () => completeMutation.mutate(so.id),
                          })
                        }
                      >
                        <IconCheck size={16} />
                      </ActionIcon>
                    )}

                    {/* CANCEL */}
                    {(so.status === "DRAFT" || so.status === "CONFIRMED") && (
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() =>
                          modals.openConfirmModal({
                            title: "Cancel Sales Order",
                            centered: true,
                            children: (
                              <Text size="sm">
                                This sales order will be cancelled and cannot be
                                completed.
                              </Text>
                            ),
                            labels: {
                              confirm: "Cancel Order",
                              cancel: "Back",
                            },
                            confirmProps: { color: "red" },
                            onConfirm: () => cancelMutation.mutate(so.id),
                          })
                        }
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
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
