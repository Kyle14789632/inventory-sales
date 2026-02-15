import { useQuery } from "@tanstack/react-query";
import { fetchPurchaseOrders } from "../../services/purchaseOrder.service";

export function usePurchaseOrders({ page, limit, search }) {
  return useQuery({
    queryKey: ["purchase-orders", page, limit, search],
    queryFn: () =>
      fetchPurchaseOrders({
        page,
        limit,
        search,
      }),
    keepPreviousData: true,
  });
}
