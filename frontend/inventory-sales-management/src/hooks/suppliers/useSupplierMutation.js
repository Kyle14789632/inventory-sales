import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  createSupplier,
  toggleSupplierStatus,
  updateSupplier,
} from "../../services/supplier.service";

export function useSupplierMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Supplier created",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create supplier",
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateSupplier(id, payload),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Supplier updated",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to update supplier",
        color: "red",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => toggleSupplierStatus(id, isActive),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Supplier status updated",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to update supplier status",
        color: "red",
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    toggleStatusMutation,
  };
}
