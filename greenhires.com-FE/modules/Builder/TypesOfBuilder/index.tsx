"use client";
import { useI18n } from "@/config/i18n/client";
import chooseTemplate from "@/public/images/resume/choose-template.svg";
import coverLetter from "@/public/images/resume/coverletter.svg";
import createWithAI from "@/public/images/resume/design-canva.png";
import { useCreateResume } from "@/services/resume/query";
import { TemplateContext } from "@/stores/template";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { toast } from "sonner";

export const ChooseTypesOfBuilder = () => {
  const [type, setType] = useState(0);
  const { setTypeOfBuilder } = useContext(TemplateContext);
  const handleClick = (typeOfBuilder: "resumeio" | "resumecanva") => {
    setTypeOfBuilder(typeOfBuilder);
  };
  const { createResume } = useCreateResume();
  const createCanvaPage = async () => {
    try {
      await createResume({
        typeOfBuilder: "resumecanva",
        title: "Untitled",
        type: "resume",
      });
    } catch (error) {
      toast.error("Create resume canva failed");
    }
  };
  const t = useI18n();
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold my-14 text-3xl text-primary-main">
        Craft a creative resume in your own style
      </h1>
      <div className="min-h-[600px] flex gap-12">
        <Link href="/resume-templates">
          <div
            onMouseOver={() => setType(0)}
            onClick={() => handleClick("resumeio")}
            className={classNames(
              "transition-all duration-500 ease-in-out text-primary-main cursor-pointer shadow-md p-6 w-[380px] h-[460px] rounded-2xl border-primary-main border-2 flex-col items-center justify-center",
              type !== 0 ? "mt-14" : "text-white bg-primary-main"
            )}
          >
            <Image
              priority
              width={50}
              height={50}
              src={
                type === 0
                  ? "/images/resume/choose-white.png"
                  : "/images/resume/choose.png"
              }
              alt="Follow us on Twitter"
            />
            <h1 className="text-xl font-bold">{t("builder.resumeiotitle")}</h1>
            <p className="my-4">{t("builder.resumeiodetail")}</p>
            <Image priority src={chooseTemplate} alt="Follow us on Twitter" />
          </div>
        </Link>
        <div>
          <div
            onMouseOver={() => setType(1)}
            onClick={() => createCanvaPage()}
            className={classNames(
              "transition-all duration-500 ease-in-out text-secondary-main cursor-pointer hover:bg-secondary-main hover:text-white shadow-md p-6 w-[380px] h-[460px] rounded-2xl border-secondary-main border-2 flex-col items-center justify-center",
              type !== 1 ? "mt-14" : "text-white bg-secondary-main"
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
            <h1 className="text-xl font-bold">
              {t("builder.resumecanvatitle")}
            </h1>
            <p className="my-4">{t("builder.resumecanvadetail")}</p>
            <Image priority src={createWithAI} alt="Follow us on Twitter" />
          </div>
        </div>
        <Link href="/coverletters">
          <div
            onMouseOver={() => setType(2)}
            className={classNames(
              "transition-all duration-500 ease-in-out text-primary-main cursor-pointer shadow-md p-6 w-[380px] h-[460px] rounded-2xl border-primary-main border-2 flex-col items-center justify-center",
              type !== 2 ? "mt-14" : "text-white bg-primary-main"
            )}
          >
            <Image
              priority
              width={40}
              height={40}
              src={
                type === 2
                  ? "/images/resume/bx_envelope_white.svg"
                  : "/images/resume/bx_envelope.svg"
              }
              alt="Follow us on Twitter"
            />
            <h1 className="text-xl font-bold">
              {t("builder.coverlettertitle")}
            </h1>
            <p className="my-4">{t("builder.coverletterdetail")}</p>
            <Image priority src={coverLetter} alt="Follow us on Twitter" />
          </div>
        </Link>
      </div>
    </div>
  );
};
