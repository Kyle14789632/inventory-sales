import {
  Table,
  Text,
  Pagination,
  Center,
  Badge,
  Group,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { useAuditLogs } from "../hooks/audit-logs/useAuditLogs";
import TableLoading from "../components/TableLoading";
import EmptyState from "../components/EmptyState";

const actionColor = {
  CREATE: "green",
  UPDATE: "blue",
  DELETE: "red",
  CANCEL: "red",
};

export default function AuditLogs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 20;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const { data, isLoading, isFetching } = useAuditLogs({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const logs = data?.data || [];
  const meta = data?.meta;
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
      sortBy: "createdAt",
      sortOrder: sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    });
  };

  if (showLoading) {
    return <TableLoading message="Loading audit logs..." />;
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        title="No audit logs"
        description="No activity has been recorded yet."
      />
    );
  }

  return (
    <>
      <Text fw={600} size="lg" mb="md">
        Audit Logs
      </Text>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <UnstyledButton onClick={toggleSort}>
                <Group gap={4}>
                  Date
                  {sortOrder === "asc" ? (
                    <IconChevronUp size={14} />
                  ) : (
                    <IconChevronDown size={14} />
                  )}
                </Group>
              </UnstyledButton>
            </Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Action</Table.Th>
            <Table.Th>Entity</Table.Th>
            <Table.Th>Description</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {logs.map((log) => (
            <Table.Tr key={log.id}>
              <Table.Td>{new Date(log.createdAt).toLocaleString()}</Table.Td>

              <Table.Td>{log.userEmail}</Table.Td>

              <Table.Td>
                <Badge variant="light">{log.role}</Badge>
              </Table.Td>

              <Table.Td>
                <Badge color={actionColor[log.action]}>{log.action}</Badge>
              </Table.Td>

              <Table.Td>{log.entity}</Table.Td>

              <Table.Td>{log.description}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {meta?.totalPages > 1 && (
        <Center mt="md">
          <Pagination
            value={page}
            total={meta.totalPages}
            onChange={(p) => updateParams({ page: p })}
          />
        </Center>
      )}
    </>
  );
}
