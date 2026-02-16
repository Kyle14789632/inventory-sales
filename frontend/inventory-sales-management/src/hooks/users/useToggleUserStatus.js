import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserStatus } from "../../services/user.service";
import { notifications } from "@mantine/notifications";

export function useToggleUserStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => toggleUserStatus(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
      notifications.show({
        title: "Updated",
        message: "User status updated",
        color: "blue",
      });
    },
  });
}
