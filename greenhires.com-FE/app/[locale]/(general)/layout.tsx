// app/[locale]/client/layout.tsx"
import { Locale } from "@/config";
import { ReactElement } from "react";
import LayoutDevice from "./layoutDevice";

export default async function GeneralLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  return <LayoutDevice params={{ locale }} children={children} />;
}
