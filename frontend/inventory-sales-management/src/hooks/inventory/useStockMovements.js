import { useQuery } from "@tanstack/react-query";
import { fetchStockMovements } from "../../services/inventory.service";

export function useStockMovements({ productId, page, limit, enabled }) {
  return useQuery({
    queryKey: ["stock-movements", productId, page, limit],
    queryFn: () =>
      fetchStockMovements({
        productId,
        page,
        limit,
      }),
    enabled,
    keepPreviousData: true,
  });
}
