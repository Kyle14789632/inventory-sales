import { useQuery } from "@tanstack/react-query";
import { fetchCategoryOptions } from "../../services/category.service";

export function useCategoryOptions() {
  return useQuery({
    queryKey: ["category-options"],
    queryFn: fetchCategoryOptions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
