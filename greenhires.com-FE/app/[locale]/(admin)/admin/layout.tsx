import { Locale } from "@/config/i18n";
import { AdminSideBar } from "@/modules/Admin/AdminSideBar";
import HeaderConsultantSetting from "@/modules/Consultant/header/HeaderSetting";
import { ReactElement } from "react";

export default function AdminLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  return (
    <div className="min-h-screen relative">
      <HeaderConsultantSetting />
      <div className="flex pt-[60px] min-h-screen bg-[#f7f9fb]">
        <AdminSideBar />
        {children}
      </div>
    </div>
  );
}
