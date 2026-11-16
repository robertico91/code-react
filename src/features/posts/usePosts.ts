import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "@/api/posts";

export function postsQueryKey(userId: number) {
  return ["users", userId, "posts"] as const;
}

export function usePosts(userId: number) {
  return useQuery({
    queryKey: postsQueryKey(userId),
    queryFn: ({ signal }) => getUserPosts(userId, signal),
  });
}
