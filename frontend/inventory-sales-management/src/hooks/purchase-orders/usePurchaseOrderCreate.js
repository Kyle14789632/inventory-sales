import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { createPurchaseOrder } from "../../services/purchaseOrder.service";

export function usePurchaseOrderCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Purchase order created",
        color: "green",
      });
      queryClient.invalidateQueries({
        queryKey: ["purchase-orders"],
      });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to create purchase order",
        color: "red",
      });
    },
  });
}
