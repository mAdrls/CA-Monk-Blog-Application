import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateBlogRequest } from "@shared/routes";
import { getQueryFn, apiRequest } from "@/lib/queryClient";

// GET /api/blogs
export function useBlogs() {
  return useQuery({
    queryKey: [api.blogs.list.path],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

// GET /api/blogs/:id
export function useBlog(id: number | null) {
  return useQuery({
    queryKey: [api.blogs.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.blogs.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch blog");
      return api.blogs.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/blogs
export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBlogRequest) => {
      const res = await apiRequest("POST", api.blogs.create.path, data);
      return api.blogs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] });
    },
  });
}
