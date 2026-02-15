import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "../../services/supplier.service";

export function useSuppliers({ page, limit, search, sortBy, sortOrder }) {
  return useQuery({
    queryKey: ["suppliers", page, limit, search, sortBy, sortOrder],
    queryFn: () =>
      fetchSuppliers({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
  });
}
