import {
  Table,
  Group,
  Text,
  Pagination,
  Center,
  TextInput,
  ActionIcon,
  Button,
  UnstyledButton,
  Badge,
} from "@mantine/core";
import {
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconPlus,
  IconChevronUp,
  IconChevronDown,
  IconRestore,
} from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { useSuppliers } from "../hooks/suppliers/useSuppliers";
import { useDebounce } from "../hooks/useDebounce";
import EmptyState from "../components/EmptyState";
import TableLoading from "../components/TableLoading";
import { useState } from "react";
import { useSupplierMutations } from "../hooks/suppliers/useSupplierMutation";
import SupplierModal from "../components/suppliers/SupplierModal";
import { modals } from "@mantine/modals";

const statusColor = {
  ACTIVE: "green",
  INACTIVE: "red",
};

export default function Suppliers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [togglingSupplierId, setTogglingSupplierId] = useState(null);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const debouncedSearch = useDebounce(search);

  const { createMutation, updateMutation, toggleStatusMutation } =
    useSupplierMutations();

  const { data, isLoading, isFetching } = useSuppliers({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const suppliers = data?.data || [];
  const meta = data?.meta;
  const showLoading = isLoading || isFetching;
  const isSearching = Boolean(search);

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
    setEditingSupplier(null);
    setModalOpened(true);
  };

  const openEdit = (supplier) => {
    setEditingSupplier(supplier);
    setModalOpened(true);
  };

  const confirmToggleStatus = (supplier) => {
    const nextIsActive = !supplier.isActive;
    const actionLabel = nextIsActive ? "Activate" : "Deactivate";

    const toggleStatus = () => {
      setTogglingSupplierId(supplier.id);
      toggleStatusMutation.mutate(
        {
          id: supplier.id,
          isActive: nextIsActive,
        },
        {
          onSettled: () => setTogglingSupplierId(null),
        },
      );
    };

    if (nextIsActive) {
      toggleStatus();
      return;
    }

    modals.openConfirmModal({
      title: "Deactivate supplier",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to deactivate <strong>{supplier.name}</strong>?
          This supplier will no longer be available for purchase orders.
        </Text>
      ),
      labels: { confirm: actionLabel, cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: toggleStatus,
    });
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Suppliers
        </Text>

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => openCreate(true)}
        >
          Add supplier
        </Button>
      </Group>

      <TextInput
        placeholder="Search supplier..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
        mb="md"
      />
      {showLoading ? (
        <TableLoading message="Loading suppliers..." />
      ) : suppliers.length === 0 ? (
        <EmptyState
          title={isSearching ? "No matching suppliers" : "No suppliers found"}
          description={
            isSearching
              ? "Try a different search term."
              : "You haven’t added any suppliers yet."
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
                <Table.Th>Contact Person</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th w={80}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {suppliers.map((supplier) => (
                <Table.Tr key={supplier.id}>
                  <Table.Td>{supplier.name}</Table.Td>
                  <Table.Td>{supplier.contactPerson || "-"}</Table.Td>
                  <Table.Td>{supplier.phone}</Table.Td>
                  <Table.Td>{supplier.email}</Table.Td>
                  <Table.Td>{supplier.address}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        statusColor[supplier.isActive ? "ACTIVE" : "INACTIVE"]
                      }
                    >
                      {supplier.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {supplier.isActive && (
                      <ActionIcon
                        variant="subtle"
                        onClick={() => openEdit(supplier)}
                        aria-label="Edit supplier"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    )}

                    <ActionIcon
                      variant="subtle"
                      color={supplier.isActive ? "red" : "green"}
                      onClick={() => confirmToggleStatus(supplier)}
                      aria-label={
                        supplier.isActive
                          ? "Deactivate supplier"
                          : "Activate supplier"
                      }
                      title={supplier.isActive ? "Deactivate" : "Activate"}
                      disabled={
                        togglingSupplierId === supplier.id &&
                        toggleStatusMutation.isPending
                      }
                      loading={
                        togglingSupplierId === supplier.id &&
                        toggleStatusMutation.isPending
                      }
                    >
                      {supplier.isActive ? (
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

      <SupplierModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        isEdit={!!editingSupplier}
        initialValues={
          editingSupplier
            ? {
                name: editingSupplier.name,
                contactPerson: editingSupplier.contactPerson || "",
                phone: editingSupplier.phone,
                email: editingSupplier.email,
                address: editingSupplier.address,
              }
            : null
        }
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => {
          if (editingSupplier) {
            updateMutation.mutate({
              id: editingSupplier.id,
              payload: values,
            });
          } else {
            createMutation.mutate(values);
          }
          setModalOpened(false);
        }}
      />
    </>
  );
}
