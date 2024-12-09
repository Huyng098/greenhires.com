import { createI18nMiddleware } from "next-international/middleware";

export const i18nMiddleware = createI18nMiddleware({
  locales: ["vn", "en"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export type Locale = "vn" | "en";
