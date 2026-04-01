import { useQuery } from "@tanstack/react-query";

import { getMyClassrooms } from "@/services/classroom-service";

export function useClassrooms() {
  return useQuery({
    queryKey: ["classrooms", "me"],
    queryFn: getMyClassrooms,
  });
}
