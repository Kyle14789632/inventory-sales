import {
  Table,
  Group,
  Text,
  TextInput,
  Pagination,
  Center,
  UnstyledButton,
  Button,
  ActionIcon,
  Badge,
} from "@mantine/core";
import {
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconEdit,
  IconTrash,
  IconEye,
  IconPlus,
  IconRestore,
} from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { useCustomers } from "../hooks/customers/useCustomers";
import TableLoading from "../components/TableLoading";
import EmptyState from "../components/EmptyState";
import { useDebounce } from "../hooks/useDebounce";
import { useState } from "react";
import CustomerModal from "../components/customers/CustomerModal";
import { useCustomerMutations } from "../hooks/customers/useCustomerMutations";
import { modals } from "@mantine/modals";

const statusColor = {
  ACTIVE: "green",
  INACTIVE: "red",
};

export default function Customers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, setOpened] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [togglingCustomerId, setTogglingCustomerId] = useState(null);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching } = useCustomers({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const { toggleStatusMutation } = useCustomerMutations();

  const customers = data?.data || [];
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

  const toggleSort = () => {
    updateParams({
      sortBy: "name",
      sortOrder: sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    });
  };

  const openCreate = () => {
    setSelectedCustomer(null);
    setOpened(true);
  };

  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setOpened(true);
  };

  const confirmToggleStatus = (customer) => {
    const nextIsActive = !customer.isActive;
    const actionLabel = nextIsActive ? "Activate" : "Deactivate";

    const toggleStatus = () => {
      setTogglingCustomerId(customer.id);
      toggleStatusMutation.mutate(
        {
          id: customer.id,
          isActive: nextIsActive,
        },
        {
          onSettled: () => setTogglingCustomerId(null),
        },
      );
    };

    if (nextIsActive) {
      toggleStatus();
      return;
    }

    modals.openConfirmModal({
      title: "Deactivate customer",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to deactivate <strong>{customer.name}</strong>?
          This customer will no longer be available for sales orders.
        </Text>
      ),
      labels: {
        confirm: actionLabel,
        cancel: "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: toggleStatus,
    });
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Customers
        </Text>

        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Customer
        </Button>
      </Group>

      <TextInput
        placeholder="Search customer..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
        mb="md"
      />

      {showLoading ? (
        <TableLoading message="Loading customers..." />
      ) : customers.length === 0 ? (
        <EmptyState
          title={isSearching ? "No matching customers" : "No customers found"}
          description={
            isSearching
              ? "Try a different search term."
              : "You haven’t added any customers yet."
          }
        />
      ) : (
        <>
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <UnstyledButton onClick={toggleSort}>
                    <Group gap={4}>
                      Name
                      {sortOrder === "asc" ? (
                        <IconChevronUp size={14} />
                      ) : (
                        <IconChevronDown size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th w={80}>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {customers.map((c) => (
                <Table.Tr key={c.id}>
                  <Table.Td>{c.name}</Table.Td>
                  <Table.Td>{c.phone || "-"}</Table.Td>
                  <Table.Td>{c.email || "-"}</Table.Td>
                  <Table.Td>{c.address || "-"}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={statusColor[c.isActive ? "ACTIVE" : "INACTIVE"]}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {c.isActive && (
                      <ActionIcon variant="subtle" onClick={() => openEdit(c)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                    )}

                    <ActionIcon
                      color={c.isActive ? "red" : "green"}
                      variant="subtle"
                      onClick={() => confirmToggleStatus(c)}
                      aria-label={
                        c.isActive ? "Deactivate customer" : "Activate customer"
                      }
                      disabled={
                        togglingCustomerId === c.id &&
                        toggleStatusMutation.isPending
                      }
                      loading={
                        togglingCustomerId === c.id &&
                        toggleStatusMutation.isPending
                      }
                    >
                      {c.isActive ? (
                        <IconTrash size={16} />
                      ) : (
                        <IconRestore size={16} />
                      )}
                    </ActionIcon>
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

      <CustomerModal
        opened={opened}
        onClose={() => setOpened(false)}
        customer={selectedCustomer}
      />
    </>
  );
}
