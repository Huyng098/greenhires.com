// app/[locale]/client/layout.tsx"
"use client";
// app/[locale]/client/layout.tsx
import { Locale } from "@/config";
import useDevices from "@/lib/hooks/useDevices";
import Footer from "@/modules/Home/Footer";
import FooterMobile from "@/modules/Home/Footer/mobile";
import Header from "@/modules/Home/Header";
import HeaderMobile from "@/modules/Home/Header/mobile";
import { ReactElement } from "react";

export default function LayoutDevice({
  params: { locale },
  children,
}: {
  params: { locale: Locale };
  children: ReactElement;
}) {
  const { isMobile } = useDevices();
  return (
    <>
      {!isMobile ? (
        <Header locale={locale} isHasTop={true} />
      ) : (
        <HeaderMobile locale={locale} isHasTop={true} />
      )}
      <div className="min-h-[calc(100vh-69px)]">{children}</div>
      {!isMobile ? <Footer /> : <FooterMobile />}
    </>
  );
}
