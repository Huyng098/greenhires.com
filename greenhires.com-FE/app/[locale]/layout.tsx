// app/[locale]/client/layout.tsx
"use client";
import { Locale } from "@/config";
import { I18nProviderClient } from "@/config/i18n/client";
import { ReactElement } from "react";

export default function SubLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
