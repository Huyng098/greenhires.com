import { Locale } from "@/config";
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
      <div className="h-[calc(100vh-60px)]">{children}</div>
    </>
  );
}
