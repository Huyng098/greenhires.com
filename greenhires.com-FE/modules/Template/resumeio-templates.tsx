"use client";
import PaginationData from "@/components/Common/PageIndex";

import { DEFAULT_TEMPLATE_PER_PAGE } from "@/constants/general";
import { Category } from "@/interfaces/general/category";
import { useURLParams } from "@/lib/hooks/useURLParams";
import classNames from "classnames";
import { Fragment, useEffect, useMemo, useState } from "react";

import { templateList } from "./templateList";
import { TemplateLocalCard } from "./TemplateLocalCard";
import { getAllPublicSamples } from "@/services/template/api";
import { TEMPLATE_LAYOUT } from "@/constants/dashboard";

interface AllTemplatesProps {
  categories: Category[];
}

export default function AllResumeIOTemplates({
  categories,
}: AllTemplatesProps) {
  const { searchParams, changeParams } = useURLParams();

  const [templates, setTemplates] = useState(templateList);

  useEffect(() => {
    getSample();
  }, []);

  const selectedCategory = useMemo(() => {
    return categories?.find(
      (category) => category.name === searchParams.get("category")
    );
  }, [searchParams.get("category")]);

  const getSample = async () => {
    // need refactor
    const samples = await getAllPublicSamples(0, 25, TEMPLATE_LAYOUT);

    if (samples?.items?.length > 0) {
      const newTemplates = samples.items;
      setTemplates(newTemplates.concat(templateList));
    }
  };
  console.log(templates);
  return (
    <Fragment>
      <div className="my-6 mx-10 flex flex-col">
        <div className="flex w-full gap-10 justify-between">
          <p
            className={classNames(
              "px-2 py-1 cursor-pointer hover:text-primary",
              selectedCategory?.name === undefined &&
                "border-b-2 border-primary"
            )}
            onClick={() =>
              changeParams({
                category: undefined,
              })
            }
          >
            All Templates
          </p>
          {categories?.map((category) => (
            <p
              className={classNames(
                "px-2 py-1 cursor-pointer hover:text-primary",
                selectedCategory?.name === category.name &&
                  "border-b-2 border-primary"
              )}
              key={category.id}
              onClick={() =>
                changeParams({
                  category: category.name,
                })
              }
            >
              {category.name}
            </p>
          ))}
        </div>
        <div className="border-t p-10 grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {templates.map((item, idx) => (
            <div key={idx}>
              <TemplateLocalCard item={item}>
                <div className="flex justify-between my-4 items-center">
                  <p>{item.name}</p>
                </div>
              </TemplateLocalCard>
            </div>
          ))}
        </div>
      </div>
      {templates.length > DEFAULT_TEMPLATE_PER_PAGE && (
        <div className="flex ml-auto">
          <PaginationData
            total_page={Math.ceil(templates.length / DEFAULT_TEMPLATE_PER_PAGE)}
            pageIdx={Number(searchParams.get("page")) || 1}
            setPageIdx={(page) => changeParams({ page: page })}
          />
        </div>
      )}
    </Fragment>
  );
}
