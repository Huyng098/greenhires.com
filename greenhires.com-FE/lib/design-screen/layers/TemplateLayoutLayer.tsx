import { generatePages } from "@/lib/utils";
import { PaginationLiveEdit } from "@/modules/Builder/Panel/PaginationLiveEdit";
import { getSampleById } from "@/services/sample/api";
import { useQuery } from "@tanstack/react-query";
import { FC, PropsWithChildren, useEffect, useRef } from "react";

interface TemplateLayoutLayerProps {
  pageNumber: number;
  sampleId: string;
}

const TemplateLayoutLayer: FC<PropsWithChildren<TemplateLayoutLayerProps>> = ({
  pageNumber,
  sampleId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLDivElement>(null);

  const {
    data: resume_data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sample", sampleId],
    queryFn: () => {
      const data = window.localStorage.getItem("resume_data");
      if (data) return JSON.parse(data);
      return getSampleById(sampleId).then((res) => res.resume_data);
    },
  });

  useEffect(() => {
    if (!tempRef.current || !resume_data) return;
    const pages = generatePages(tempRef);
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

export default TemplateLayoutLayer;
