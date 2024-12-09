"use client";
import { Locale } from "@/config";
import useDevices from "@/lib/hooks/useDevices";
import { DashboardSidebar } from "@/modules/Dashboard/Profile/DashboardSidebar";
import DashboardSidebarMobile from "@/modules/Dashboard/Profile/mobile/DashboardSidebarMobile";
import Header from "@/modules/Home/Header";
import HeaderMobile from "@/modules/Home/Header/mobile";
import { ReactElement } from "react";

export default function DashboardLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  const { isMobile } = useDevices();
  return (
    <div className="h-screen">
      {!isMobile ? (
        <Header locale={locale} isHasTop={true} />
      ) : (
        <HeaderMobile locale={locale} isHasTop={true} />
      )}
      <div className="min-h-screen flex pt-12 md:pt-[130px]">
        {!isMobile && <DashboardSidebar />}
        {children}
      </div>
      {isMobile && <DashboardSidebarMobile />}
    </div>
  );
}
