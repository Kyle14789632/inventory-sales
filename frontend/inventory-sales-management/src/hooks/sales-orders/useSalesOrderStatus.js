import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  confirmSalesOrder,
  completeSalesOrder,
  cancelSalesOrder,
} from "../../services/salesOrder.service";

export function useSalesOrderStatus() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["sales-orders"] });
    qc.invalidateQueries({ queryKey: ["sales-order"] });
    qc.invalidateQueries({ queryKey: ["inventory"] });
  };

  const confirmMutation = useMutation({
    mutationFn: confirmSalesOrder,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Sales order confirmed",
        color: "green",
      });
      invalidate();
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to confirm sales order",
        color: "red",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeSalesOrder,
    onSuccess: () => {
      notifications.show({
        title: "Completed",
        message: "Sales order completed",
        color: "green",
      });
      invalidate();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSalesOrder,
    onSuccess: () => {
      notifications.show({
        title: "Cancelled",
        message: "Sales order cancelled",
        color: "orange",
      });
      invalidate();
    },
  });

  return {
    confirmMutation,
    completeMutation,
    cancelMutation,
  };
}
