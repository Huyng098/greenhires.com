"use client";
import { Loading } from "@/components/Common/Loading";
import {
  COVER_LETTER,
  SAMPLE_TYPES,
  LAYOUT,
  TEMPLATE_CANVA,
  TEMPLATE_LAYOUT,
} from "@/constants/dashboard";
import { Category } from "@/interfaces/general/category";
import MySamples from "@/modules/Consultant/MySamples";
import { useGetAllSample } from "@/services/sample/query";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";

interface Props {
  categories: Category[];
}

interface ITemplateButton {
  label: string;
  value: SAMPLE_TYPES;
  selectedType: SAMPLE_TYPES;
  onClick: (type: SAMPLE_TYPES) => void;
}

const TemplateButton: FC<ITemplateButton> = ({
  label,
  value,
  selectedType,
  onClick,
}) => (
  <button
    onClick={() => onClick(value)}
    className={`text-base font-bold ${
      selectedType === value ? "bg-[#2F566B] text-white" : "text-[#2F566B]"
    } px-10 py-2 rounded-full`}
  >
    {label}
  </button>
);

const templates = [
  { label: "Template (Canva)", value: TEMPLATE_CANVA },
  { label: "Template (Layout)", value: TEMPLATE_LAYOUT },
  { label: "Layout", value: LAYOUT },
  { label: "Cover Letter", value: COVER_LETTER },
];

const SampleDashBoard = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] =
    useState<SAMPLE_TYPES>(TEMPLATE_CANVA);
  const page = Number(searchParams.get("page")) ?? 0;
  const limit = 7;
  const { data, isPending } = useGetAllSample(
    page,
    limit,
    undefined,
    undefined,
    undefined,
    undefined,
    "my",
    selectedType
  );

  return (
    <div className="w-full p-3">
      <p className="text-center text-2xl text-primary-main font-medium my-5">
        Dashboard
      </p>
      <div className="mt-8 border-[1px] rounded-full text-primary w-fit">
        {templates.map((template) => (
          <TemplateButton
            key={template.value}
            label={template.label}
            value={template.value as SAMPLE_TYPES}
            selectedType={selectedType}
            onClick={setSelectedType}
          />
        ))}
      </div>
      {isPending ? (
        <Loading color="#2F566B" />
      ) : (
        <MySamples
          samples={data?.items!}
          categorize
          categories={categories}
          totalSample={data?.total!}
          selectedType={selectedType}
        />
      )}
    </div>
  );
};

export default SampleDashBoard;
