"use client";
import { useI18n } from "@/config/i18n/client";
import chooseTemplate from "@/public/assets/findjob.svg";
import createWithAI from "@/public/images/resume/create-with-ai.svg";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const JobCVPage = () => {
  const [type, setType] = useState(-1);
  const t = useI18n();
  return (
    <div className="pt-40 flex flex-col justify-center items-center">
      <div className="min-h-[600px] flex gap-12">
        <Link href="/choose-types-of-builder">
          <div
            onMouseOver={() => setType(1)}
            className={classNames(
              "transition-all duration-500 ease-in-out text-secondary-main cursor-pointer hover:bg-secondary-main hover:text-white shadow-md p-6 w-[380px] h-[460px] rounded-2xl border-secondary-main border-2 flex-col items-center justify-center",
              (type === -1 || type === 0) && "mt-14"
            )}
          >
            <Image
              priority
              width={35}
              height={35}
              src={
                type === 1
                  ? "/images/resume/edit-white.png"
                  : "/images/resume/edit.png"
              }
              alt="Follow us on Twitter"
            />
            <h1 className="text-xl font-bold">{t("hero.cvtitle")}</h1>
            <p className="my-4">{t("hero.cvdetail")}</p>
            <Image priority src={createWithAI} alt="Follow us on Twitter" />
          </div>
        </Link>
        <Link href="/job-searching">
          <div
            onMouseOver={() => setType(0)}
            className={classNames(
              "transition-all duration-500 ease-in-out text-primary-main cursor-pointer shadow-md p-6 w-[380px] h-[460px] rounded-2xl border-primary-main border-2 flex-col items-center justify-center",
              type === 1 ? "mt-14" : "text-white bg-primary-main"
            )}
          >
            <Image
              priority
              width={50}
              height={50}
              src={
                type === -1 || type === 0
                  ? "/images/resume/choose-white.png"
                  : "/images/resume/choose.png"
              }
              alt="Follow us on Twitter"
            />
            <h1 className="text-xl font-bold">{t("hero.jobtitle")}</h1>
            <p className="my-4">{t("hero.jobdetail")}</p>

            <Image priority src={chooseTemplate} alt="Follow us on Twitter" />
          </div>
        </Link>
      </div>
    </div>
  );
};
