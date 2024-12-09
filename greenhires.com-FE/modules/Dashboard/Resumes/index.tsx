"use client";
import { Loading } from "@/components/Common/Loading";
import PaginationData from "@/components/Common/PageIndex";
import { DEFAULT_RESUME_PER_PAGE } from "@/constants/general";
import { useURLParams } from "@/lib/hooks/useURLParams";
import { useMyCVs } from "@/services/resume/query";
import { useState } from "react";
import { CreateResumeCard } from "./_components/create-card";
import { ResumeCard } from "./_components/resume-card";
import { COVER_LETTER, RESUME, TYPE } from "@/constants/dashboard";

interface MyResumesProps {
  categorize?: boolean;
}

export default function MyResumes({ categorize }: MyResumesProps) {
  const { searchParams, changeParams } = useURLParams();
  const [selectedType, setSelectedType] = useState<TYPE>(RESUME);
  const { cvs, isPending } = useMyCVs(selectedType);
  if (isPending) {
    return (
      <div className="h-full w-full justify-center items-center">
        <Loading color="#2f566b" />
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col w-full mt-12">
      <div className="mx-10 border-[1px] rounded-full text-primary w-fit">
        <button
          onClick={() => setSelectedType(RESUME)}
          className={`w-[150px] text-base font-bold ${selectedType === RESUME ? "bg-[#2F566B] text-white" : "text-[#2F566B]"} px-10 py-2 rounded-full `}
        >
          Resume
        </button>
        <button
          onClick={() => setSelectedType(COVER_LETTER)}
          className={`w-[200px] text-base font-bold ${selectedType === COVER_LETTER ? "bg-[#2F566B] text-white" : "text-[#2F566B]"} px-10 py-2 rounded-full `}
        >
          Cover Letter
        </button>
      </div>
      <div className="p-8 grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full">
        <CreateResumeCard type={selectedType} />
        {cvs &&
          cvs?.length > 0 &&
          cvs
            ?.slice(
              Number(searchParams.get("page") || 1) - 1,
              Number(searchParams.get("page") || 1) -
                1 +
                DEFAULT_RESUME_PER_PAGE
            )
            .map((resume) => (
              <div key={resume.id} className="bg-white rounded-lg shadow-xl">
                <ResumeCard resume={resume} categorize={categorize} />
              </div>
            ))}
      </div>
      {cvs && cvs?.length > DEFAULT_RESUME_PER_PAGE && (
        <PaginationData
          total_page={Math.ceil(cvs.length / DEFAULT_RESUME_PER_PAGE)}
          pageIdx={Number(searchParams.get("page")) || 1}
          setPageIdx={(page) => changeParams({ page: page })}
        />
      )}
    </div>
  );
}
