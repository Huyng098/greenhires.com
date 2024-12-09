"use client";
import { useI18n } from "@/config/i18n/client";
import Image from "next/image";

const IntroductionMobile = () => {
  const t = useI18n();
  return (
    <section
      id="introduction"
      className="overflow-hidden py-8 md:py-10 lg:py-14"
    >
      <div className="container">
        <div className="flex items-center justify-center flex-col">
          <div>
            <Image
              src="/images/logo/intro_people.png"
              alt="introduction"
              width={600}
              height={600}
            />
          </div>
          <div className=" space-y-5">
            <p className="text-2xl font-medium">{t("introduction.title")}</p>
            <p className="text-zinc-500">{t("introduction.detail")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionMobile;
