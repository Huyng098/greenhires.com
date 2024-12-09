import { generatePages } from "@/lib/utils";
import { PaginationLiveEdit } from "@/modules/Builder/Panel/PaginationLiveEdit";
import { getTemplatePadding } from "@/modules/TemplateDisplay/templates/template-padding";
import { fetchResumeById } from "@/services/resume/api";
import { useQuery } from "@tanstack/react-query";
import { FC, PropsWithChildren, useEffect, useRef } from "react";

interface ResumeLayerProps {
  pageNumber: number;
  resumeId: string;
}

const ResumeLayer: FC<PropsWithChildren<ResumeLayerProps>> = ({
  pageNumber,
  resumeId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLDivElement>(null);

  const {
    data: resume_data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: () => {
      const data = window.localStorage.getItem("resume_data");
      if (data) return JSON.parse(data);
      return fetchResumeById(resumeId).then((res) => res.resume_data);
    },
  });

  useEffect(() => {
    if (!tempRef.current || !resume_data) return;
    const padding = getTemplatePadding(resume_data.metadata.template);
    const pages = generatePages(
      tempRef,
      padding.top,
      padding.right,
      padding.bottom,
      padding.left
    );
    if (containerRef.current && pages[pageNumber]) {
      containerRef.current.innerHTML = "";
      const clone = pages[pageNumber].cloneNode(true) as HTMLDivElement;
      Array.from(clone.attributes).forEach((attr) => {
        containerRef.current!.setAttribute(attr.name, attr.value);
      });
      while (clone.firstChild) {
        containerRef.current.appendChild(clone.firstChild);
      }
    }
  }, [tempRef.current, resume_data, pageNumber]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      {resume_data && (
        <PaginationLiveEdit ref={tempRef} resume_data={resume_data} />
      )}
      <div ref={containerRef} />
    </>
  );
};

export default ResumeLayer;
