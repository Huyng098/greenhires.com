import { Locale } from "@/config";
import HeaderConsultantSetting from "@/modules/Consultant/header/HeaderSetting";
import { ReactElement } from "react";

export default function ConsultantLayout({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  return (
    <>
      <HeaderConsultantSetting />
      <div className="pt-[60px]">{children}</div>
    </>
  );
}
