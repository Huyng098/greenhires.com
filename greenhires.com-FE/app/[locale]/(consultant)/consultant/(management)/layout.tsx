import { Locale } from "@/config/i18n";
import { ConsultantSidebar } from "@/modules/Consultant/SettingSidebar";
import HeaderConsultantSetting from "@/modules/Consultant/header/HeaderSetting";
import { ReactElement } from "react";

export default function ManagementConsultantLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  return (
    <div className="min-h-screen relative">
      <HeaderConsultantSetting />

      <div className="flex min-h-screen bg-[#f7f9fb]">
        <ConsultantSidebar />
        {children}
      </div>
    </div>
  );
}
