import { Drawer, Table, Text, Pagination, Center, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { useStockMovements } from "../../hooks/inventory/useStockMovements";
import TableLoading from "../TableLoading";

export default function StockMovementDrawer({ opened, onClose, product }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isFetching } = useStockMovements({
    productId: product?.id,
    page,
    limit,
    enabled: Boolean(product?.id),
  });

  useEffect(() => {
    if (!opened) {
      setPage(1);
    }
  }, [opened]);

  const movements = data?.data || [];
  const meta = data?.meta;

  const showLoading = isLoading || isFetching;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={product ? `Stock Movements - ${product.name}` : "Stock Movements"}
      size="lg"
      position="right"
    >
      {showLoading ? (
        <TableLoading message="Loading stock movements..." />
      ) : movements.length === 0 ? (
        <Text c="dimmed" size="sm">
          No stock movements found.
        </Text>
      ) : (
        <>
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Qty</Table.Th>
                <Table.Th>Remarks</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {movements.map((m) => (
                <Table.Tr key={m.id}>
                  <Table.Td>
                    {new Date(m.createdAt).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>{m.type}</Table.Td>
                  <Table.Td>{m.quantity}</Table.Td>
                  <Table.Td>{m.note || "-"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {meta?.totalPages > 1 && (
            <Center mt="md">
              <Pagination
                value={page}
                onChange={setPage}
                total={meta.totalPages}
              />
            </Center>
          )}
        </>
      )}
    </Drawer>
  );
}
