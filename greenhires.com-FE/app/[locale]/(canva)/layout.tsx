import { Locale } from "@/config";
import Header from "@/modules/Home/Header";
import { ReactElement } from "react";

export default function CanvaLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  return (
    <>
      <Header locale={locale} isHasTop={false} />
      <div className="h-[calc(100vh-58px)]">{children}</div>
    </>
  );
}
