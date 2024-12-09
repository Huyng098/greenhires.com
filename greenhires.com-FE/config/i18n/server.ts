import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  vn: () => import("@/dictionaries/vn"),
  en: () => import("@/dictionaries/en"),
});
