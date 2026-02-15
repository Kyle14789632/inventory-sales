import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { updatePurchaseOrder } from "../../services/purchaseOrder.service";

export function usePurchaseOrderUpdate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updatePurchaseOrder(id, payload),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Purchase order updated",
        color: "green",
      });
      qc.invalidateQueries({ queryKey: ["purchase-orders"] });
      qc.invalidateQueries({ queryKey: ["purchase-order"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to update purchase order",
        color: "red",
      });
    },
  });
}
