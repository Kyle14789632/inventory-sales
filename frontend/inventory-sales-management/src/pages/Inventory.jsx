import {
  Table,
  Group,
  Text,
  Badge,
  Pagination,
  Center,
  TextInput,
  ActionIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  IconSearch,
  IconHistory,
  IconEdit,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useInventory } from "../hooks/inventory/useInventory";
import EmptyState from "../components/EmptyState";
import TableLoading from "../components/TableLoading";
import StockMovementDrawer from "../components/inventory/StockMovementDrawer";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import StockAdjustmentModal from "../components/inventory/StockAdjustmentModal";
import { modals } from "@mantine/modals";

export default function Inventory() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustOpened, setAdjustOpened] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState(null);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const debouncedSearch = useDebounce(search);

  const { inventoryQuery, adjustStockMutation } = useInventory({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const { data, isFetching, isLoading } = inventoryQuery;

  const items = data?.data || [];
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

  const openHistory = (product) => {
    setSelectedProduct(product);
    setDrawerOpened(true);
  };

  const openAdjust = (product) => {
    setAdjustProduct(product);
    setAdjustOpened(true);
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Inventory
        </Text>

        <TextInput
          placeholder="Search product or SKU..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
          w={300}
        />
      </Group>

      {showLoading ? (
        <TableLoading message="Loading inventory..." />
      ) : items.length === 0 ? (
        <EmptyState
          title={isSearching ? "No matching products" : "No inventory data"}
          description={
            isSearching
              ? "Try a different search term."
              : "No products found in inventory."
          }
        />
      ) : (
        <>
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <UnstyledButton
                    onClick={() =>
                      updateParams({
                        sortBy: "name",
                        sortOrder: sortOrder === "asc" ? "desc" : "asc",
                        page: 1,
                      })
                    }
                  >
                    <Group gap={4}>
                      Product
                      {sortOrder === "asc" ? (
                        <IconChevronUp size={14} />
                      ) : (
                        <IconChevronDown size={14} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
                <Table.Th>SKU</Table.Th>
                <Table.Th ta="right">Stock</Table.Th>
                <Table.Th ta="right">Reorder Level</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>History</Table.Th>
                {isAdmin && <Table.Th w={80}>Adjust</Table.Th>}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {items.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{item.sku}</Table.Td>
                  <Table.Td ta="right">{item.currentStock}</Table.Td>
                  <Table.Td ta="right">{item.reorderLevel}</Table.Td>
                  <Table.Td>
                    <Badge color={item.isLowStock ? "red" : "green"}>
                      {item.isLowStock ? "Low" : "OK"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => openHistory(item)}
                      aria-label="View stock history"
                    >
                      <IconHistory size={16} />
                    </ActionIcon>
                  </Table.Td>
                  {isAdmin && (
                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => openAdjust(item)}
                        aria-label="Adjust stock"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Table.Td>
                  )}
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
      <StockAdjustmentModal
        opened={adjustOpened}
        onClose={() => setAdjustOpened(false)}
        product={adjustProduct}
        submitting={adjustStockMutation.isPending}
        onSubmit={(payload) => {
          if (payload.type === "OUT") {
            modals.openConfirmModal({
              title: "Confirm stock removal",
              children: (
                <Text size="sm">
                  This will permanently reduce stock for{" "}
                  <strong>{adjustProduct?.name}</strong>.
                </Text>
              ),
              labels: {
                confirm: "Remove",
                cancel: "Cancel",
              },
              confirmProps: { color: "red" },
              onConfirm: () => adjustStockMutation.mutate(payload),
            });
            return;
          }
          adjustStockMutation.mutate(payload);
          setAdjustOpened(false);
        }}
      />

      <StockMovementDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        product={selectedProduct}
      />
    </>
  );
}
