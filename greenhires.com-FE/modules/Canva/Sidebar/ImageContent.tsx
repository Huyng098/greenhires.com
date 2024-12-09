import { Loading } from "@/components/Common/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMAGE_KEY } from "@/constants/query_key";
import { useEditor } from "@/lib/design-editor";
import { getAllImages, getImageById } from "@/services/canva/image/api";
import MagnifyingGlassIcon from "@duyank/icons/regular/MagnifyingGlass";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import Photo from "./Photo";

const ImageContent = () => {
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const { actions } = useEditor();
  const [page, setPage] = useState<number>(0);

  const { isError, error, data, isFetching } = useQuery({
    queryKey: [...IMAGE_KEY, query, page],
    queryFn: async () => {
      return await getAllImages({
        q: query,
        page: page + "",
        per_page: "26",
      });
    },
    placeholderData: keepPreviousData,
  });
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(keyword);
  };

  const addImage = async (item: {
    id: string;
    image: string;
    thumb: string;
    width: number;
    height: number;
    username: string;
    name: string;
  }) => {
    actions.addImageLayer(
      { thumb: item.thumb, url: item.image },
      { width: item.width, height: item.height }
    );
    await getImageById(item.id);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-center flex-shrink-0 h-[48px] border-b  border-b-[rgba(57,76,96,.15)] px-[20px]">
        <p className="text-white leading-[48px] grow font-[600]">Images</p>
      </div>
      <div className="flex flex-col overflow-y-auto grow">
        <div className="rounded-[4px] shadow-[0px 0px 0px 1px rgba(43,59,74,0.3)] m-[16px]">
          <div className="h-[40px]  rounded-[4px] px-[12px] flex items-center">
            <div className="font-[24px] flex-shrink-0 mr-[8px] text-white">
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
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center min-w-[350px]">
        {isFetching ? (
          <Loading color="#FFFFFF" />
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 px-4">
              {data?.items.map((item) => (
                <Photo
                  key={item.id}
                  image={item.thumb}
                  name={item.name}
                  username={item.username}
                  onClick={() => {
                    addImage(item);
                  }}
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
                  if (!(page * 26 > (data?.total ?? 0))) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={page * 26 + 26 > (data?.total ?? 0)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageContent;
