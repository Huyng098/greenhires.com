"use client";
import { Locale } from "@/config";
import useDevices from "@/lib/hooks/useDevices";
import Header from "@/modules/Home/Header";
import HeaderMobile from "@/modules/Home/Header/mobile";
import BuilderProvider from "@/stores/builder";
import { ReactElement } from "react";

export default function TemplateLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  const { isMobile } = useDevices();
  return (
    <BuilderProvider>
      {!isMobile ? (
        <Header locale={locale} isHasTop={false} />
      ) : (
        <HeaderMobile locale={locale} isHasTop={false} />
      )}
      <div className={`h-[calc(100vh-72px)] ${isMobile && "mt-[72px]"}`}>
        {children}
      </div>
    </BuilderProvider>
  );
}
