import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  createCustomer,
  toggleCustomerStatus,
  updateCustomer,
} from "../../services/customer.service";

export function useCustomerMutations() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["customers"] });
    qc.invalidateQueries({ queryKey: ["customer-options"] });
  };

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Customer created",
        color: "green",
      });
      invalidate();
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create customer",
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCustomer(id, payload),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Customer updated",
        color: "green",
      });
      invalidate();
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to update customer",
        color: "red",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => toggleCustomerStatus(id, isActive),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Customer status updated",
        color: "green",
      });
      invalidate();
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to update customer status",
        color: "red",
      });
    },
  });

  return { createMutation, updateMutation, toggleStatusMutation };
}
