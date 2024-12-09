"use client";
import { Button } from "@/components/ui/button";
import { useCreateResumeLinkedin } from "@/services/resume/query";
import { TemplateContext } from "@/stores/template";
import { useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { UploadFilePond } from "./uploadFile";

export default function ResumeParser() {
  const [files, setFiles] = useState<File[]>([]);
  const { templateId, typeOfBuilder, typeOfCV } = useContext(TemplateContext);
  const fileUrl = useMemo(() => {
    if (files.length === 0) {
      return "";
    }
    return URL.createObjectURL(files[0]);
  }, [files]);
  const { createResumeLinkedin, isPending } = useCreateResumeLinkedin();
  const createNewResumeFromLinkedin = async (title: string) => {
    if (files.length === 0) {
      return;
    }
    try {
      if (!typeOfCV) {
        toast.error("Please select type of CV");
        return;
      }
      const formData = new FormData();
      formData.append("linkedin_file", files[0]);
      formData.append("title", title);
      formData.append("builder_type", typeOfBuilder);
      formData.append("type", typeOfCV);
      if (templateId) {
        formData.append("template_id", templateId);
      }
      toast.promise(createResumeLinkedin(formData), {
        loading: "Parsing and creating resume...",
        error: "Parsing and creating resume failed",
      });
    } catch (error) {
      toast.error("Create resume failed");
    }
  };

  return (
    <main className="h-screen w-full ">
      <div className="grid md:grid-cols-6 h-full">
        <div className="flex justify-center px-2 md:col-span-3 h-full">
          {files.length > 0 && (
            <section className="mt-5 grow px-4  md:px-0">
              <div className="h-4/5 aspect-w-7">
                <iframe
                  src={`${fileUrl}#navpanes=0`}
                  className="h-full w-full"
                />
              </div>
            </section>
          )}
        </div>
        <div className="md:col-span-3 p-5">
          <div className="w-full h-full text-right">
            <UploadFilePond
              files={files}
              maxFiles={1}
              allowMultiple={false}
              acceptFileTypes={["application/pdf"]}
              onChange={(items) => {
                setFiles(items.map((item) => item.file as File));
              }}
            />

            <Button
              disabled={isPending}
              onClick={() => createNewResumeFromLinkedin("Untitled")}
              className="bg-primary-main hover:bg-primary-main/85"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
