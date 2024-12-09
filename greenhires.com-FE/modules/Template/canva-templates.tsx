"use client";
import PaginationData from "@/components/Common/PageIndex";

import { Loading } from "@/components/Common/Loading";
import { DEFAULT_TEMPLATE_PER_PAGE } from "@/constants/general";
import { TEMPLATES_KEY } from "@/constants/query_key";
import { Category } from "@/interfaces/general/category";
import { useURLParams } from "@/lib/hooks/useURLParams";
import { getAllPublicSamples } from "@/services/template/api";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { Fragment, useMemo, useState } from "react";
import { TemplateCard } from "../Builder/TypesOfBuilder/template-card";

interface AllTemplatesProps {
  categories: Category[];
}

export default function AllCanvaTemplates({ categories }: AllTemplatesProps) {
  const { searchParams, changeParams } = useURLParams();
  const selectedCategory = useMemo(() => {
    return categories?.find(
      (category) => category.name === searchParams.get("category")
    );
  }, [searchParams.get("category")]);
  const { data, isPending } = useQuery({
    queryKey: [
      ...TEMPLATES_KEY,
      searchParams.get("page"),
      selectedCategory?.id || undefined,
    ],
    queryFn: async () => {
      try {
        return await getAllPublicSamples(
          Number(searchParams.get("page") || 1) - 1,
          DEFAULT_TEMPLATE_PER_PAGE,
          "template",
          selectedCategory?.id || undefined
        );
      } catch (error) {
        console.error("Error fetching templates", error);
        return null;
      }
    },
  });
  const [currentVariant, setCurrentVariant] = useState(0);
  if (isPending) return <Loading color="#2F566B" />;

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
          {data?.items.map((template, idx) => (
            <div key={idx}>
              <TemplateCard template={template} variantIdx={currentVariant}>
                <div className="flex justify-between my-4 items-center">
                  <p>{template.name}</p>
                  <div className="flex gap-2">
                    {template.variants.map((variant, idx) => (
                      <div
                        key={idx}
                        style={
                          currentVariant !== idx
                            ? { backgroundColor: variant.color }
                            : { border: `3px solid ${variant.color}` }
                        }
                        onMouseEnter={() => setCurrentVariant(idx)}
                        className="rounded-full h-5 w-5 cursor-pointer"
                      ></div>
                    ))}
                  </div>
                </div>
                <p className="text-xs line-clamp-2 hover:text-clip">
                  {template.summary}
                </p>
              </TemplateCard>
            </div>
          ))}
        </div>
      </div>
      {data?.total! > DEFAULT_TEMPLATE_PER_PAGE && (
        <div className="flex ml-auto">
          <PaginationData
            total_page={Math.ceil(data?.total! / DEFAULT_TEMPLATE_PER_PAGE)}
            pageIdx={Number(searchParams.get("page")) || 1}
            setPageIdx={(page) => changeParams({ page: page })}
          />
        </div>
      )}
    </Fragment>
  );
}
