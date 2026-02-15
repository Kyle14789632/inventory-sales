import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../../services/customer.service";

export function useCustomers({ page, limit, search, sortBy, sortOrder }) {
  return useQuery({
    queryKey: ["customers", page, limit, search, sortBy, sortOrder],
    queryFn: () =>
      fetchCustomers({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
  });
}
