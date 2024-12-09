"use client";
import ScrollUp from "@/components/Common/ScrollUp";
import useDevices from "@/lib/hooks/useDevices";
import { BlogHome } from "@/modules/Blog/blogHome";
import Banner from "@/modules/Home/Banner";
import { JobCVPage } from "@/modules/Home/Banner/job-resume";
import BannerMobile from "@/modules/Home/Banner/mobile";
import Contact from "@/modules/Home/Contact";
import ContactMobile from "@/modules/Home/Contact/mobile";
import Features from "@/modules/Home/Features";
import FeaturesMobile from "@/modules/Home/Features/mobile";
import Introduction from "@/modules/Home/Introduction";
import IntroductionMobile from "@/modules/Home/Introduction/mobile";
import Menu from "@/modules/Home/Menu";
import MenuMobile from "@/modules/Home/Menu/mobile";
import Testimonials from "@/modules/Home/Testimonials";
import { useGetMe } from "@/services/user";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isMobile } = useDevices();
  const searchParams = useSearchParams();
  const socialLogin = searchParams.get("socialLogin");
  const { getMe } = useGetMe();

  useEffect(() => {
    if (socialLogin) {
      getMe();
    }
  }, [socialLogin]);
  console.log(socialLogin);
  return (
    <>
      {!isMobile ? (
        <>
          <ScrollUp />
          <JobCVPage />
          <Banner type="job" />
          <Menu />
          <Testimonials />
          <Introduction />
          <Features />
          <BlogHome />
          <Contact />
        </>
      ) : (
        <>
          <ScrollUp />
          <JobCVPage />
          <BannerMobile />
          <MenuMobile />
          <Testimonials />
          <IntroductionMobile />
          <FeaturesMobile />
          <BlogHome />
          <ContactMobile />
        </>
      )}
    </>
  );
}
