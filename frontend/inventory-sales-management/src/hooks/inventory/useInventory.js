import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStockMovement,
  fetchInventoryStock,
} from "../../services/inventory.service";
import { notifications } from "@mantine/notifications";

export function useInventory({ page, limit, search, sortBy, sortOrder }) {
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: ["inventory", page, limit, search, sortBy, sortOrder],
    queryFn: () =>
      fetchInventoryStock({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
  });

  const adjustStockMutation = useMutation({
    mutationFn: createStockMovement,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Stock adjusted successfully",
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to adjust stock",
        color: "red",
      });
    },
  });

  return {
    inventoryQuery,
    adjustStockMutation,
  };
}
