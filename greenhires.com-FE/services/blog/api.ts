"use server";
import { BLOG } from "@/constants/apis";
import { ErrorResponse } from "@/interfaces/base";
import {
  BlogDto,
  ChangeStatusCommentForm,
  CommentDto,
  CommentForm,
} from "@/interfaces/blog";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { http } from "@/utils/http";
import { format } from "date-fns";
import { revalidateTag } from "next/cache";
import qs from "query-string";
export const getAllBlogs = async (
  page: number,
  limit: number,
  status?: string,
  start_date?: Date,
  end_date?: Date,
  category_id?: string,
  restrict?: string
): Promise<PaginatedResponse<BlogDto>> => {
  const query_str = qs.stringify(
    {
      page,
      limit,
      status,
      start_date: start_date ? format(start_date, "yyyy-MM-dd") : undefined,
      end_date: end_date ? format(end_date, "yyyy-MM-dd") : undefined,
      category_id,
      restrict,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(
    `${BLOG.ALL}?${query_str}`,
    { next: { tags: ["blogs"] } },
    true
  );
};

export const getAllPublicBlogs = async (
  offset: number,
  limit: number
): Promise<PaginatedResponse<BlogDto>> => {
  const query_str = qs.stringify(
    {
      offset: offset,
      limit,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(
    `${BLOG.PUBLIC}?${query_str}`,
    { next: { tags: ["blogs"] } },
    true
  );
};

export const getRelatedBlogs = async (
  id: string,
  limit: number = 5
): Promise<BlogDto[]> => {
  return await http.get(`${BLOG.RELATED(id)}?limit=${limit}`, undefined, true);
};

export const deleteBlogById = async (
  id: string | undefined
): Promise<BlogDto | ErrorResponse> => {
  revalidateTag("blogs");
  return await http.delete(`${BLOG.DELETE(id)}`, undefined, true);
};

export const addBlog = async (data: FormData) => {
  return await http.post(
    BLOG.ALL,
    data,
    {
      headers: {},
    },
    true
  );
};

export const editBlog = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) => {
  return await http.put(
    `${BLOG.EDIT(id)}`,
    data,
    {
      headers: {},
    },
    true
  );
};

export const getBlogById = async (id: string): Promise<BlogDto> => {
  return await http.get(
    `${BLOG.GET_BY_ID(id)}`,
    { next: { tags: ["blogs"] } },
    true
  );
};

export const addComment = async (
  data: CommentForm
): Promise<CommentDto | ErrorResponse> => {
  return await http.post(BLOG.ADD_COMMENT, data, {}, true);
};

export const editComment = async (
  id: string | undefined,
  data: CommentForm
) => {
  return await http.put(`${BLOG.EDIT_COMMENT(id)}`, data, {}, true);
};

export const updateStatusComment = async ({
  blogId,
  data,
}: {
  blogId: string;
  data: ChangeStatusCommentForm;
}) => {
  return await http.put(
    `${BLOG.UPDATE_STATUS_COMMENT(blogId)}`,
    data,
    {},
    true
  );
};

export const getParentComment = async (
  blog_id: string,
  limit: number,
  offset: number,
  is_hidden: boolean | undefined
): Promise<PaginatedResponse<CommentDto>> => {
  const query_str = qs.stringify(
    {
      blog_id,
      limit,
      offset,
      is_hidden,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(
    `${BLOG.GET_PARENT_COMMENT}?${query_str}`,
    { next: { tags: ["blogs"] } },
    true
  );
};
export const getChildComment = async (
  parent_id: string | undefined
): Promise<CommentDto[]> => {
  const query_str = qs.stringify(
    {
      parent_id,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(
    `${BLOG.GET_CHILD_COMMENT}?${query_str}`,
    { next: { tags: ["blogs"] } },
    true
  );
};
