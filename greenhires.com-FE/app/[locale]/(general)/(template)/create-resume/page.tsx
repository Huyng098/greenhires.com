"use client";
import { useCreateResume } from "@/services/resume/query";
import { TemplateContext } from "@/stores/template";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useContext } from "react";
import { toast } from "sonner";

export default function CreateResume() {
  const { templateId, templateVariant, typeOfBuilder, typeOfCV, resume_data } =
    useContext(TemplateContext);
  const router = useRouter();
  const { createResume } = useCreateResume();
  function clearStringValues<T>(obj: T): T {
    // Kiểm tra nếu obj không phải là một đối tượng hoặc là null
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    // Tạo một đối tượng mới để lưu trữ kết quả
    const newObj: any = Array.isArray(obj) ? [] : {};

    // Duyệt qua từng key trong đối tượng
    for (const key in obj) {
      // Sử dụng Object.prototype.hasOwnProperty.call để kiểm tra
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Kiểm tra nếu key là 'name' hoặc 'key', nếu có thì bỏ qua
        if (key === "name" || key === "key") {
          newObj[key] = obj[key];
          continue;
        }

        const value = obj[key];

        // Nếu value là string, gán thành ""
        if (typeof value === "string") {
          newObj[key] = "";
        } else if (typeof value === "object") {
          // Nếu value là object hoặc array, gọi đệ quy
          newObj[key] = clearStringValues(value);
        } else {
          // Nếu không phải là string hay object, giữ nguyên giá trị
          newObj[key] = value;
        }
      }
    }

    return newObj as T;
  }

  const createNewResume = async (title: string) => {
    if (!typeOfCV) {
      toast.error("Please select type of resume");
      return;
    }
    try {
      const resume_data_clear_string = clearStringValues(resume_data);
      console.log(resume_data_clear_string);
      await createResume({
        typeOfBuilder,
        templateId,
        templateVariant,
        title,
        type: typeOfCV,
        resume_data: resume_data_clear_string,
      });
    } catch (error) {
      toast.error("Create resume failed");
    }
  };
  return (
    <Fragment>
      <div className="flex mt-10 flex-col justify-center items-center text-primary-main">
        <h1 className="text-2xl font-bold">
          {" "}
          How do you want to start your resume?
        </h1>
        <p> Start from scratch or upload your LinkedIn profile</p>
      </div>
      <div className="mx-40 my-20 grid grid-cols-2 gap-10">
        <div
          onClick={() => createNewResume("Untitled")}
          className="
            transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 cursor-pointer duration-300
          border-primary-main border-2 flex flex-col items-center justify-center bg-background p-10 rounded-lg shadow-lg"
        >
          <h1 className="text-xl text-primary-main font-medium">
            {" "}
            Start from Scratch
          </h1>
          <p className="text-gray-400 mb-4">
            {" "}
            Create a new resume from scratch
          </p>
          <Image
            src="/images/resume/updateresume-blog-01.png"
            alt="LinkedIn"
            width={866}
            height={519}
          />
        </div>
        <div
          onClick={() => router.push("/linkedin-parsing-resume")}
          className="
        transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 cursor-pointer duration-300
        border-secondary-main border-2 flex flex-col items-center justify-center bg-background p-10 rounded-lg shadow-lg"
        >
          <h1 className="text-xl font-medium text-secondary-main">
            {" "}
            Upload LinkedIn Profile
          </h1>
          <p className="text-gray-400 mb-4">
            {" "}
            Use your LinkedIn profile to create a resume
          </p>
          <Image
            src="/images/resume/resume-linkedin.gif"
            alt="LinkedIn"
            width={866}
            height={519}
          />
        </div>
      </div>
    </Fragment>
  );
}
