import { TYPE } from "./dashboard";

export const AUTH = {
  LOGIN: "/auth/tokens",
  REFRESH_TOKEN: "/auth/refresh-token",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  RESEND_OTP: "/auth/resend-otp",
  VERIFY_CODE: "/auth/verify-code",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFY_EMAIL: "/auth/resend-verification-email",
  LOGIN_WITH_GOOGLE: "/auth/google/login",
  LOGIN_WITH_FACEBOOK: "/auth/facebook/login",
  LOGIN_WITH_LINKEDIN: "/auth/linkedin-openid/login",
};

export const USER = {
  MINE: "/users/me",
  UPDATE_INFO: "/users/change-my-info",
  UPDATE_PASSWORD: "/users/change-password",
  LOGOUT: "/users/logout",
  ALL: "/users",
  DELETE_ME: "/users",
  DELETE: (id: string) => `/users/${id}`,
  UPDATE_ROLE: (id: string) => `/users/change-role-user/${id}`,
  ADD: "/users",
  CANVA_IMAGE: "/users/canva-images",
};

export const CATEGORY = {
  ALL: "/general/category",
};

export const RESUME = {
  CREATE_FROM_SCRATCH: "/resume",
  MINES: (type: TYPE) => `/resume?type=${type}`,
  CREATE_FROM_LINKEDIN: "/resume/create-from-linkedin",
  IMPORT: "/resume/import",
  EXPORT: (id: string, format: string = "pdf") =>
    `/resume/export/${id}?format=${format}`,
  DETAIL: (id: string) => `/resume/${id}`,
  SHARE: (username: string, slug: string) =>
    `/resume/public/${username}/${slug}`,
  PARSING: "/resume/parsing",
  AVATAR: "/general/storage/upload",
  PREVIEW: (id: string) => `/resume/preview/${id}`,
};

export const SAMPLE = {
  ALL: "/sample",
  EXPORT: (id: string) => `/sample/export/${id}`,
  PUBLIC: "/sample/public-samples",
  DELETE: "/sample",
  DUPLICATE: "/sample/import",
  FRAME: "/sample/frames",
  REPLACE_VARIANT: (sample_id: string) =>
    `/sample/replace-variant/${sample_id}`,
  FONTS: "/sample/fonts",
  IMAGES: "/sample/images",
  TEXTSTYLE: "/sample/textstyles",
  GRAPHICS: "/sample/graphics",
  GRAPHIC_DOWNLOAD: "/sample/graphics/download",
  GET_BY_ID: (id: string) => `/sample/${id}`,
  CHANGE_STATUS: (id: string) => `/sample/update-status/${id}`,
  ADD: "/sample",
  UPDATE: (id: string) => `/sample/${id}`,
};

export const GENERAL = {
  IMAGE: "/general/storage/upload",
  UPLOAD: "/general/upload",
};

export const BLOG = {
  ALL: "/blog",
  RELATED: (id: string) => `/search/related-blogs/${id}`,
  PUBLIC: "/blog/public-blogs",
  EDIT: (id: string) => `/blog/${id}`,
  GET_BY_ID: (id: string) => `/blog/${id}`,
  DELETE: (id: string | undefined) => `/blog/${id}`,
  ADD_COMMENT: "/blog/add-comment-blog",
  EDIT_COMMENT: (id: string | undefined) => `/blog/comment/${id}`,
  UPDATE_STATUS_COMMENT: (blogId: string | undefined) =>
    `/blog/update-status/${blogId}`,
  GET_PARENT_COMMENT: "/blog/parent-comments",
  GET_CHILD_COMMENT: "/blog/child-comments",
};

export const NOTIFICATION = {
  ALL: "/notification",
  READ: "/notification/mark-status",
  UNREAD_QUANTITY: "/notification/unread-counts",
  MARK_ALL_AS_READ: "/notification/mark-all-as-read",
  REGISTER: "/notification/notify",
};

export const BACKGROUND = {
  DELETE: (id: string) => `/ai/background-image/${id}`,
  MY: "/ai/my-background",
  ALL: "/ai/background-image",
  ADD: "/ai/upload-background",
};

export const PAYMENT = {
  ALL_PACKAGE: "/payment/packages",
  GET_BY_FREQUENCY: (frequency: string) =>
    `/payment/package?frequency=${frequency}`,
  PAYMENT: "/payment",
  CHECK_BINDING: "/payment/check-binding",
  HISTORY: "/payment/billing-history",
  PAYPAL_ORDER: "/payment/paypal-order",
  PAYPAL_PLAN: "/payment/paypal-plan",
  UPDATE_SUBSCRIPTION: (id: string) => `/payment/update-subscription/${id}`,
  CURRENT_SUBSCRIPTION: "/payment/current-subscription",
};

export const KEYWORD = {
  ADD: "/ai/add-keywords",
};
