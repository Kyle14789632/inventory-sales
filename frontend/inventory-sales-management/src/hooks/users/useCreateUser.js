import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../services/user.service";
import { notifications } from "@mantine/notifications";

export function useCreateUser(onSuccess) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
      notifications.show({
        title: "Success",
        message: "User created successfully",
        color: "green",
      });
      onSuccess?.();
    },
  });
}
