"use client";
import { Loading } from "@/components/Common/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GRAPHIC_KEY } from "@/constants/query_key";
import { useEditor } from "@/lib/design-editor";
import {
  getAllGraphics,
  getGraphicDownload,
} from "@/services/canva/graphic/api";
import { uploadImage } from "@/services/general/api";
import MagnifyingGlassIcon from "@duyank/icons/regular/MagnifyingGlass";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";

const GraphicContent = () => {
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const { actions } = useEditor();
  const [page, setPage] = useState<number>(0);

  const { isError, error, data, isFetching } = useQuery({
    queryKey: [...GRAPHIC_KEY, query, page],
    queryFn: async () => {
      return await getAllGraphics({
        q: query,
        offset: page * 100,
        limit: 100,
      });
    },
    placeholderData: keepPreviousData,
  });
  const addGraphic = async (item: {
    id: string;
    thumb: string;
    downloadUrl: string;
  }) => {
    const res = await getGraphicDownload(item.downloadUrl);
    const file = res.file;
    const parser = new DOMParser();
    const ele = parser.parseFromString(file, "text/xml").documentElement;
    const viewBox = ele.getAttribute("viewBox")?.split(" ") || [];
    const width =
      viewBox.length === 4 ? +viewBox[2] : +(ele.getAttribute("width") || 100);
    const height =
      viewBox.length === 4 ? +viewBox[3] : +(ele.getAttribute("height") || 100);

    const svgBlob = new Blob([ele.outerHTML], {
      type: "image/svg+xml;charset=utf-8",
    });
    const formData = new FormData();

    formData.append("image", svgBlob, "image.svg");
    formData.append("type", "general");

    const data = await uploadImage(formData);
    actions.addSvgLayer(data.url, { width, height }, ele);
  };
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(keyword);
  };
  return (
    <>
      <div className="h-[40px] rounded-[4px] px-[12px] flex items-center">
        <div className="font-[24px] mr-[8px] flex-shrink-0 text-white">
          <MagnifyingGlassIcon />
        </div>
        <form onSubmit={(e) => handleSearch(e)}>
          <Input
            value={keyword}
            className="w-full h-full focus-visible:ring-0 focus-visible:ring-offset-0"
            type={"text"}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center min-w-[350px]">
        {isFetching ? (
          <Loading color="#FFFFFF" />
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3 px-4">
              {data?.items.map((item: any) => (
                <Image
                  className="cursor-pointer"
                  onClick={() => addGraphic(item)}
                  alt={`Graphic`}
                  src={item.thumb}
                  key={item.id}
                  width={62}
                  height={62}
                />
              ))}
            </div>
            <div className="flex justify-end gap-5 w-full mr-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={page === 0}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (!(page * 100 > (data?.total ?? 0))) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={page * 100 + 100 > (data?.total ?? 0)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GraphicContent;
