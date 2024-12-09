// app/[locale]/client/layout.tsx
import { TemplateProvider } from "@/stores/template";
import { ReactElement } from "react";
export default function GeneralLayout({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <TemplateProvider>
      <div className="h-[calc(100%-120px)] pt-[130px]">{children}</div>
    </TemplateProvider>
  );
}
