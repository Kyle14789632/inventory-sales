import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";
import { notifications } from "@mantine/notifications";

export function useCategories({ page, limit, search, sortBy, sortOrder }) {
  const queryClient = useQueryClient();

  // QUERY
  const categoriesQuery = useQuery({
    queryKey: ["categories", page, limit, search, sortBy, sortOrder],
    queryFn: () =>
      fetchCategories({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Category created",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to create category",
        color: "red",
      });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Category updated",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      notifications.show({
        title: "Deleted",
        message: "Category removed",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categoriesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
