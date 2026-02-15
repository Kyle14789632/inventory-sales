import {
  Table,
  Group,
  Text,
  ActionIcon,
  Pagination,
  Center,
  TextInput,
  UnstyledButton,
  Badge,
  Button,
  Modal,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconEye,
  IconPlus,
  IconEdit,
  IconTrash,
  IconRestore,
} from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/products/useProducts";
import EmptyState from "../components/EmptyState";
import TableLoading from "../components/TableLoading";
import { useState } from "react";
import ProductForm from "../components/products/ProductForm";
import { useCategoryOptions } from "../hooks/categories/useCategoryOptions";
import { PRODUCT_FORM_DEFAULTS } from "../constants/productDefaults";

const statusColor = {
  ACTIVE: "green",
  INACTIVE: "red",
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(null);
  const [togglingProductId, setTogglingProductId] = useState(null);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const debouncedSearch = useDebounce(search);

  const {
    productsQuery,
    createMutation,
    updateMutation,
    toggleStatusMutation,
  } = useProducts({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoryOptions();

  const { data, isLoading, isFetching } = productsQuery;
  const products = data?.data || [];
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
      sortOrder: sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    });
  };

  const openCreate = () => {
    setEditing(null);
    setOpened(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setOpened(true);
  };

  const confirmToggleStatus = (product) => {
    const nextIsActive = !product.isActive;
    const actionLabel = nextIsActive ? "Activate" : "Deactivate";

    const toggleStatus = () => {
      setTogglingProductId(product.id);
      toggleStatusMutation.mutate(
        {
          id: product.id,
          isActive: nextIsActive,
        },
        {
          onSettled: () => setTogglingProductId(null),
        },
      );
    };

    if (nextIsActive) {
      toggleStatus();
      return;
    }

    modals.openConfirmModal({
      title: "Deactivate product",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to deactivate <strong>{product.name}</strong>?
          This product will no longer appear in sales and inventory.
        </Text>
      ),
      labels: { confirm: actionLabel, cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: toggleStatus,
    });
  };

  const initialValues = editing
    ? {
        sku: editing.sku ?? "",
        name: editing.name ?? "",
        description: editing.description ?? "",
        categoryId: editing.category?.id ?? "",
        unit: editing.unit ?? "pcs",
        costPrice: Number(editing.costPrice ?? 0),
        sellingPrice: Number(editing.sellingPrice ?? 0),
        reorderLevel: Number(editing.reorderLevel ?? 0),
        isActive: editing.isActive ?? true,
      }
    : PRODUCT_FORM_DEFAULTS;

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Products
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Product
        </Button>
      </Group>

      <TextInput
        placeholder="Search products (name or SKU)..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
        mb="md"
      />

      {showLoading ? (
        <TableLoading message="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title={isSearching ? "No matching products" : "No products found"}
          description={
            isSearching
              ? "Try a different search term."
              : "You haven’t added any products yet."
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
                <Table.Th>SKU</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>

                <Table.Th w={80}>Actions </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {products.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>{p.name}</Table.Td>
                  <Table.Td>{p.sku}</Table.Td>
                  <Table.Td>{p.category?.name}</Table.Td>
                  <Table.Td>₱{p.sellingPrice}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={statusColor[p.isActive ? "ACTIVE" : "INACTIVE"]}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {p.isActive && (
                      <ActionIcon
                        variant="subtle"
                        onClick={() => openEdit(p)}
                        aria-label="Edit product"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    )}

                    <ActionIcon
                      variant="subtle"
                      color={p.isActive ? "red" : "green"}
                      onClick={() => confirmToggleStatus(p)}
                      aria-label={
                        p.isActive ? "Deactivate product" : "Activate product"
                      }
                      title={p.isActive ? "Deactivate" : "Activate"}
                      disabled={
                        togglingProductId === p.id &&
                        toggleStatusMutation.isPending
                      }
                      loading={
                        togglingProductId === p.id &&
                        toggleStatusMutation.isPending
                      }
                    >
                      {p.isActive ? (
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

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? "Edit product" : "Add product"}
        centered
      >
        {categoriesLoading ? (
          <Text size="sm" c="dimmed">
            Loading categories...
          </Text>
        ) : (
          <ProductForm
            categories={categories} // fetched from backend
            initialValues={initialValues}
            submitting={createMutation.isPending || updateMutation.isPending}
            onSubmit={(values) => {
              if (editing) {
                updateMutation.mutate({
                  id: editing.id,
                  payload: values,
                });
              } else {
                createMutation.mutate(values);
              }
              setOpened(false);
            }}
          />
        )}
      </Modal>
    </>
  );
}
