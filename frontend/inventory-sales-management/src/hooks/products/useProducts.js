import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
} from "../../services/product.service";

export function useProducts({ page, limit, search, sortBy, sortOrder }) {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products", page, limit, search, sortBy, sortOrder],
    queryFn: () =>
      fetchProducts({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Product created",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Product updated",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to update product",
        color: "red",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => toggleProductStatus(id, isActive),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Product status updated",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to update product status",
        color: "red",
      });
    },
  });

  return {
    productsQuery,
    createMutation,
    updateMutation,
    toggleStatusMutation,
  };
}
