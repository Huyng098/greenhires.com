"use client";
import { useI18n } from "@/config/i18n/client";
import Image from "next/image";
import Link from "next/link";

const BannerMobile = () => {
  const t = useI18n();
  return (
    <>
      <section
        id="banner"
        className="relative  bg-[url('/images/hero/bg-hero.png')] bg-cover pt-[200px]"
      >
        <div className="flex flex-col-reverse container">
          <div>
            <p className="text-4xl font-bold"> {t("hero.cvtitle")} </p>
            <p className="text-xl text-primary my-6"> {t("hero.cvdetail")} </p>
            <Link
              href="#"
              className="inline-block rounded-md bg-primary-main px-8 py-4 text-base
               font-semibold text-white duration-300 ease-in-out hover:bg-black/90
                dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
            >
              {t("hero.cvexplore")}
            </Link>
          </div>
          <div className="ml-auto">
            <Image
              src="/images/hero/hero-human.png"
              alt="image"
              width={700}
              height={700}
            />
          </div>
        </div>
        <div className="absolute top-24 left-1/3 z-[-1] opacity-30 lg:opacity-100">
          <Image
            src="/images/banner/mask.svg"
            alt="image"
            width={641}
            height={556}
          />
        </div>
      </section>
    </>
  );
};

export default BannerMobile;
