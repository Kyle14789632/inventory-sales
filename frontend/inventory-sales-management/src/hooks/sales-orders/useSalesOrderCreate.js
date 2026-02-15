import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { createSalesOrder } from "../../services/salesOrder.service";

export function useSalesOrderCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Sales order created",
        color: "green",
      });
      qc.invalidateQueries({ queryKey: ["sales-orders"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create sales order",
        color: "red",
      });
    },
  });
}
