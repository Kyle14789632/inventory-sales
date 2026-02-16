import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../services/user.service";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}
