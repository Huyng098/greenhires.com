"use client";
import PaginationData from "@/components/Common/PageIndex";
import { DEFAULT_RESUME_PER_PAGE } from "@/constants/general";
import { Category } from "@/interfaces/general/category";
import { SampleDto } from "@/interfaces/sample/sample";
import { useURLParams } from "@/lib/hooks/useURLParams";
import { CreateSampleCard } from "./CreateSampleCard";
import { SampleCard } from "./SampleCard";
import { SAMPLE_TYPES } from "@/constants/dashboard";

interface MySamplesProps {
  totalSample: number;
  samples: SampleDto[];
  categorize?: boolean;
  categories: Category[];
  selectedType: SAMPLE_TYPES;
}

export default function MySamples({
  selectedType,
  totalSample,
  samples,
  categorize,
  categories,
}: MySamplesProps) {
  const { searchParams, changeParams } = useURLParams();
  return (
    <div className="flex flex-col w-full mt-6">
      <div className="p-8 grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full">
        <CreateSampleCard selectedType={selectedType} />
        {samples
          ?.slice(
            Number(searchParams.get("page") || 1) - 1,
            Number(searchParams.get("page") || 1) - 1 + DEFAULT_RESUME_PER_PAGE
          )
          .map((sample) => (
            <div key={sample.id} className="bg-white rounded-lg shadow-xl">
              <SampleCard
                sample={sample}
                categorize={categorize}
                categories={categories}
              />
            </div>
          ))}
      </div>
      {totalSample > DEFAULT_RESUME_PER_PAGE && (
        <PaginationData
          total_page={Math.ceil(totalSample / DEFAULT_RESUME_PER_PAGE)}
          pageIdx={Number(searchParams.get("page")) || 1}
          setPageIdx={(page) => changeParams({ page: page })}
        />
      )}
    </div>
  );
}
