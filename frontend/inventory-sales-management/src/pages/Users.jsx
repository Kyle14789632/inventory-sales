import {
  Table,
  Text,
  Badge,
  Button,
  Group,
  Modal,
  TextInput,
  PasswordInput,
  Select,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  IconUserPlus,
  IconTrash,
  IconRestore,
  IconPlus,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { useUsers } from "../hooks/users/useUsers";
import { useCreateUser } from "../hooks/users/useCreateUser";
import { useToggleUserStatus } from "../hooks/users/useToggleUserStatus";
import TableLoading from "../components/TableLoading";
import { useAuth } from "../hooks/useAuth";

export default function Users() {
  const { user: currentUser } = useAuth();

  const { data: users = [], isLoading } = useUsers();
  const toggleMutation = useToggleUserStatus();

  const [opened, { open, close }] = useDisclosure(false);
  const [togglingUserId, setTogglingUserId] = useState(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      role: "STAFF",
    },
  });

  const createMutation = useCreateUser(() => {
    close();
    form.reset();
  });

  const confirmToggleStatus = (user) => {
    const nextIsActive = !user.isActive;
    const actionLabel = nextIsActive ? "Activate" : "Deactivate";

    const toggleStatus = () => {
      setTogglingUserId(user.id);
      toggleMutation.mutate(
        {
          id: user.id,
          isActive: nextIsActive,
        },
        {
          onSettled: () => setTogglingUserId(null),
        },
      );
    };

    if (nextIsActive) {
      toggleStatus();
      return;
    }

    modals.openConfirmModal({
      title: "Deactivate user",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to deactivate <strong>{user.email}</strong>?
          This user will no longer be able to sign in.
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

  if (isLoading) {
    return <TableLoading message="Loading users..." />;
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          User Management
        </Text>

        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Create User
        </Button>
      </Group>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th w={80}>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {users.map((u) => (
            <Table.Tr key={u.id}>
              <Table.Td>{u.email}</Table.Td>

              <Table.Td>
                <Badge color={u.role === "ADMIN" ? "red" : "blue"}>
                  {u.role}
                </Badge>
              </Table.Td>

              <Table.Td>
                <Badge color={u.isActive ? "green" : "gray"}>
                  {u.isActive ? "Active" : "Inactive"}
                </Badge>
              </Table.Td>

              <Table.Td>{new Date(u.createdAt).toLocaleDateString()}</Table.Td>

              <Table.Td>
                {currentUser.id !== u.id && (
                  <ActionIcon
                    color={u.isActive ? "red" : "green"}
                    variant="subtle"
                    onClick={() => confirmToggleStatus(u)}
                    aria-label={
                      u.isActive ? "Deactivate user" : "Activate user"
                    }
                    disabled={
                      togglingUserId === u.id && toggleMutation.isPending
                    }
                    loading={
                      togglingUserId === u.id && toggleMutation.isPending
                    }
                  >
                    {u.isActive ? (
                      <IconTrash size={16} />
                    ) : (
                      <IconRestore size={16} />
                    )}
                  </ActionIcon>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Create User Modal */}
      <Modal opened={opened} onClose={close} title="Create User">
        <form
          onSubmit={form.onSubmit((values) => createMutation.mutate(values))}
        >
          <TextInput label="Email" required {...form.getInputProps("email")} />

          <PasswordInput
            label="Password"
            required
            mt="sm"
            {...form.getInputProps("password")}
          />

          <Select
            label="Role"
            data={[
              { value: "STAFF", label: "STAFF" },
              { value: "ADMIN", label: "ADMIN" },
            ]}
            mt="sm"
            {...form.getInputProps("role")}
          />

          <Button
            type="submit"
            fullWidth
            mt="md"
            loading={createMutation.isLoading}
          >
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
}
