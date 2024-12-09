import {
  BLOG_KEY,
  CHILD_COMMENT_KEY,
  PARENT_COMMENT_KEY,
} from "@/constants/query_key";
import { CommentDto } from "@/interfaces/blog";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addBlog,
  addComment,
  deleteBlogById,
  editBlog,
  getAllBlogs,
  getAllPublicBlogs,
  getChildComment,
  getParentComment,
  updateStatusComment,
} from "./api";

export const useGetAllBlogs = (
  page: number,
  limit: number,
  status?: string,
  start_date?: Date,
  end_date?: Date,
  category_id?: string,
  restrict?: string
) => {
  const { data, error, isPending } = useQuery({
    queryKey: [
      ...BLOG_KEY,
      { page, limit, status, start_date, end_date, category_id, restrict },
    ],
    queryFn: async () => {
      return await getAllBlogs(
        page,
        limit,
        status,
        start_date,
        end_date,
        category_id,
        restrict
      );
    },
  });
  return { data, error, isPending };
};

export const useGetAllPublicBlogs = (page: number, limit: number) => {
  const { data, error, isPending } = useQuery({
    queryKey: [...BLOG_KEY, { page, limit }],
    queryFn: async () => {
      return await getAllPublicBlogs((page - 1) * limit, limit);
    },
  });
  return { data, error, isPending };
};

export const useAddBlog = () => {
  const {
    error,
    isPending: isAdding,
    mutateAsync,
    isSuccess,
  } = useMutation({
    mutationFn: addBlog,
    onSuccess: (data) => {
      if (data.error_code) {
        toast.error(data.detail);
        return;
      }
      toast.success("Add Blog Successfully");
    },
  });
  return { addBlog: mutateAsync, isAdding, error, isSuccess };
};

export const useEditBlog = () => {
  const {
    error,
    isPending: isEditing,
    mutateAsync,
    isSuccess,
  } = useMutation({
    mutationFn: editBlog,
    onSuccess: (data) => {
      if (data.error_code) {
        toast.error(data.detail);
        return;
      }
      toast.success("Edit Blog Successfully");
    },
  });
  return { editBlog: mutateAsync, isEditing, error, isSuccess };
};

export const useDeleteBlogById = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate } = useMutation({
    mutationFn: deleteBlogById,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...BLOG_KEY] });
      toast.success("Delete Blog Successfully");
    },
  });
  return { deleteBlogById: mutate, isPending, error };
};

export const useAddComment = (role: string) => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate, isSuccess, data } = useMutation({
    mutationFn: addComment,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      if (role === "superadmin" || role === "admin") {
        if (data.parent_comment_id) {
          queryClient.setQueryData(
            [CHILD_COMMENT_KEY, { parent_id: data.parent_comment_id }],
            (oldData: CommentDto[]) => {
              return [...oldData, data];
            }
          );
        }
      }
      toast.success("Your comment has been submitted");
    },
  });
  return { addComment: mutate, data, isPending, error, isSuccess };
};

export const useGetParentComments = (
  blog_id: string,
  limit: number,
  role?: string
) => {
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      PARENT_COMMENT_KEY,
      {
        blog_id,
      },
    ],
    queryFn: async ({ pageParam }) => {
      const is_hidden =
        role === "superadmin" || role === "admin" ? undefined : false;
      return await getParentComment(blog_id, limit, pageParam, is_hidden);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * limit < lastPage.total
        ? allPages.length * limit
        : undefined,
  });
  return {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export const useGetChildComments = (parent_id: string | undefined) => {
  const { data, error, isPending } = useQuery({
    queryKey: [CHILD_COMMENT_KEY, { parent_id }],
    queryFn: async () => {
      return await getChildComment(parent_id);
    },
    enabled: !!parent_id,
  });
  return { data, error, isPending };
};

export const useUpdateBlogById = () => {
  const queryClient = useQueryClient();
  const { error, isPending, mutate, reset, isSuccess } = useMutation({
    mutationFn: editBlog,
    onSuccess: (data) => {
      if (data.error_code) {
        toast.error(data.detail);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [...BLOG_KEY] });
      toast.success("Update blog successfully");
    },
  });
  return { editBlogById: mutate, isPending, error, isSuccess };
};

export const useUpdateStatusComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: updateStatusComment,
    onSuccess: (data) => {
      if (data.error_code) {
        toast.error(data.detail);
        return;
      }
      toast.success("Update status successfully");
    },
  });
  return { updateStatusBlogCmt: mutateAsync };
};
