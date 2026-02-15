import {
  Table,
  Group,
  Button,
  ActionIcon,
  Text,
  Modal,
  TextInput,
  Pagination,
  Center,
  UnstyledButton,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState } from "react";
import { useCategories } from "../hooks/categories/useCategories";
import EmptyState from "../components/EmptyState";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import TableLoading from "../components/TableLoading";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const debouncedSearch = useDebounce(search);

  const { categoriesQuery, createMutation, updateMutation, deleteMutation } =
    useCategories({ page, limit, search: debouncedSearch, sortBy, sortOrder });

  const { data, isFetching, isLoading } = categoriesQuery;

  const categories = data?.data || [];
  const meta = data?.meta;

  const showLoading = isLoading || isFetching;

  const isSearching = Boolean(search);

  const updateParams = (newParams) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params;
    });
  };

  const handleSearchChange = (e) => {
    updateParams({
      search: e.target.value,
      page: 1,
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
    setName("");
    setOpened(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setName(category.name);
    setOpened(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        payload: { name },
      });
    } else {
      createMutation.mutate({ name });
    }
  };

  const confirmDelete = (category) => {
    modals.openConfirmModal({
      title: "Delete category",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{category.name}</strong>? This
          action cannot be undone.
        </Text>
      ),

      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate(category.id),
    });
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Categories
        </Text>

        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Category
        </Button>
      </Group>

      <TextInput
        placeholder="Search categories..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={handleSearchChange}
        mb="md" 
      />

      {showLoading ? (
        <TableLoading message="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState
          title={isSearching ? "No matching categories" : "No categories found"}
          description={
            isSearching
              ? "Try a different search term."
              : "You haven’t added any categories yet."
          }
          actionLabel={!isSearching ? "Add category" : null}
          onAction={!isSearching ? openCreate : undefined}
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
                <Table.Th w={80}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {categories.map((category) => (
                <Table.Tr key={category.id}>
                  <Table.Td>{category.name}</Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => openEdit(category)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>

                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => confirmDelete(category)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {meta && meta.totalPages > 1 && (
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
        title={editing ? "Edit Category" : "Add Category"}
        centered
      >
        <TextInput
          label="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Group justify="flex-end" mt="md">
          <Button onClick={handleSubmit}>
            {editing ? "Update" : "Create"}
          </Button>
        </Group>
      </Modal>
    </>
  );
}
