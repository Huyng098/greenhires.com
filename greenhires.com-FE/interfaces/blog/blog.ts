import { z } from "zod";

export interface BlogDto {
  banner: string;
  title: string;
  content: string;
  category_id: string;
  id: string;
  status: "pending" | "waiting" | "approved" | "rejected";
  author_id: string;
  author_name: string;
  category_name: string;
  author_picture: string;
  created_at: Date;
  updated_at: Date;
  comments: {
    time: string;
    content: string;
    admin_name: string;
  }[];
}

export const blogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  category_id: z.string().min(1, { message: "Category is required" }),
  banner: z
    .any()
    .refine(
      (banner) => banner?.[0]?.size / 1024 / 1024 <= 5,
      `Max image size is 5MB.`
    ),
  status: z.string().default("pending"),
});

export type IBlogForm = z.infer<typeof blogSchema>;

export interface CommentForm {
  content?: string;
  blog_id?: string;
  parent_comment_id?: string;
  isHidden?: boolean;
}

export interface ChangeStatusCommentForm {
  status?: "pending" | "waiting" | "approved" | "rejected";
  comment?: string;
}

export interface CommentDto {
  id?: string;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
  account_id?: string;
  isHidden?: boolean;
  blog_id?: string;
  parent_comment_id?: string;
  commenter_picture?: string;
  commenter_name?: string;
  num_of_children?: number | null;
  isCommentClient?: boolean;
}
