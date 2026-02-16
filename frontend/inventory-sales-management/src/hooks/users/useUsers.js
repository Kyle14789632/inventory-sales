import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../services/user.service";

export function useUsers({ page, limit, sortBy, sortOrder }) {
  return useQuery({
    queryKey: ["users", page, limit, sortBy, sortOrder],
    queryFn: () =>
      fetchUsers({
        page,
        limit,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
  });
}
