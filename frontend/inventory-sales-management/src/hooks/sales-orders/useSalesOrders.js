import { useQuery } from "@tanstack/react-query";
import { fetchSalesOrders } from "../../services/salesOrder.service";

export function useSalesOrders({ page, limit, search }) {
  return useQuery({
    queryKey: ["sales-orders", page, limit, search],
    queryFn: () => fetchSalesOrders({ page, limit, search }),
    keepPreviousData: true,
  });
}
