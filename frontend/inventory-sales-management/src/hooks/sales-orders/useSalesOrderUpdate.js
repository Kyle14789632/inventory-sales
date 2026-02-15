import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { updateSalesOrder } from "../../services/salesOrder.service";

export function useSalesOrderUpdate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateSalesOrder(id, payload),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Sales order updated",
        color: "green",
      });
      qc.invalidateQueries({ queryKey: ["sales-orders"] });
      qc.invalidateQueries({ queryKey: ["sales-order"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to update sales order",
        color: "red",
      });
    },
  });
}
