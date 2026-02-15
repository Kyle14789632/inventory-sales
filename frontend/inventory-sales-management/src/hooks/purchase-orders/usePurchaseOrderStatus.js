import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  markPurchaseOrderOrdered,
  receivePurchaseOrder,
  cancelPurchaseOrder,
} from "../../services/purchaseOrder.service";

export function usePurchaseOrderStatus() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["purchase-orders"] });
    qc.invalidateQueries({ queryKey: ["purchase-order"] });
    qc.invalidateQueries({ queryKey: ["inventory"] });
    qc.invalidateQueries({ queryKey: ["stock-movements"] });
  };

  const orderMutation = useMutation({
    mutationFn: markPurchaseOrderOrdered,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Purchase order marked as ORDERED",
        color: "green",
      });
      invalidate();
    },
  });

  const receiveMutation = useMutation({
    mutationFn: receivePurchaseOrder,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Purchase order received. Stock updated.",
        color: "green",
      });
      invalidate();
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to receive purchase order",
        color: "red",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelPurchaseOrder,
    onSuccess: () => {
      notifications.show({
        title: "Cancelled",
        message: "Purchase order cancelled",
        color: "orange",
      });
      invalidate();
    },
  });

  return {
    orderMutation,
    receiveMutation,
    cancelMutation,
  };
}
