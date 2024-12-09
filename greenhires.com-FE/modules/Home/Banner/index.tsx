"use client";
import { useI18n } from "@/config/i18n/client";
import Image from "next/image";
import Link from "next/link";

interface Props {
  type: string;
}

const Banner = ({ type }: Props) => {
  const t = useI18n();
  return (
    <section
      id="banner"
      className="relative bg-[url('/images/hero/bg-hero.png')] bg-cover"
    >
      <div className="flex container items-center">
        <div className="w-1/3 ml-28">
          <p className="text-4xl font-bold">
            {" "}
            {type === "cv" ? t("hero.cvtitle") : t("hero.jobtitle")}{" "}
          </p>
          <p className="text-xl text-primary my-6">
            {" "}
            {type === "cv" ? t("hero.cvdetail") : t("hero.jobdetail")}{" "}
          </p>
          <Link
            href={type === "cv" ? "/dashboard/resumes" : "/job-searching"}
            className="inline-block rounded-md bg-primary-main px-8 py-4 text-base
               font-semibold text-white duration-300 ease-in-out hover:bg-primary-main/90
                dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
          >
            {type === "cv" ? t("hero.cvexplore") : t("hero.jobexplore")}
          </Link>
        </div>
        <div className="ml-[60px] relative">
          <Image
            src="/images/banner/img_banner_1.svg"
            alt="image"
            width={700}
            height={700}
          />
          <Image
            src="/images/banner/img_banner_2.svg"
            alt="image"
            width={400}
            height={400}
            className="absolute top-[50px] left-[50px] transform scale-75  xl:scale-100  xl:top-[100px] xl:left-[100px] lg:top-[60px] lg:left-[60px]"
          />
          <Image
            src="/images/banner/img_banner_3.svg"
            alt="image"
            width={200}
            height={200}
            className="absolute top-[250px] left-[-40px]  transform scale-75  lg:scale-100 lg:top-[262px] lg:left-[-57px] xl:top-[320px] xl:left-[-50px]"
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
  );
};

export default Banner;
