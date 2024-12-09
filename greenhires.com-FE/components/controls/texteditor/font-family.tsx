import { Toggle } from "@/components/ui/toggle";
import { FONTS_KEY } from "@/constants/query_key";
import { getAllTextFont } from "@/services/canva";
import { Check, TextT } from "@phosphor-icons/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Divider, Popover } from "antd";
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import qs from "query-string";
import { debounce } from "lodash";
import { FontData } from "@lidojs/design-core";
import { Loading } from "@/components/Common/Loading";
import { useInView } from "react-intersection-observer";
import { Tooltip } from "@/components/ui/tooltip";

interface IProps {
  onChangeFontFamily: (font: FontData) => void;
}

const FontFamilyTiptap: FC<IProps> = ({ onChangeFontFamily }) => {
  const qRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("");
  const { ref, inView } = useInView({
    trackVisibility: true,
    delay: 500,
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [FONTS_KEY, keyword],
      queryFn: async ({ pageParam = 0 }) => {
        const query_str = qs.stringify(
          {
            limit: 50,
            offset: pageParam * 50,
            q: keyword,
          },
          {
            skipNull: true,
            skipEmptyString: true,
          }
        );
        return await getAllTextFont(query_str).then((res) => res.items);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 0 ? null : allPages.length + 1,
    });

  const debouncedSetKeyword = useCallback(
    debounce((value) => {
      setKeyword(value);
    }, 500),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSetKeyword(e.target.value);
  };

  useEffect(() => {
    inView && hasNextPage && fetchNextPage();
  }, [fetchNextPage, inView, hasNextPage]);

  return (
    <div>
      <Popover
        rootClassName="z-[9999]"
        content={
          <div>
            <div className="h-10 rounded-sm px-3 flex items-center border w-full">
              <div className="text-2xl mr-2 shrink-0">
                <MagnifyingGlassIcon />
              </div>
              <input
                onChange={handleChange}
                className="h-full w-full"
                ref={qRef}
                type="text"
                onClick={() => qRef.current?.focus()}
              />
            </div>
            <Divider className="my-2" />
            <div className="max-h-52 overflow-y-auto">
              {data?.pages.map((page, pageIdx) => (
                <div key={pageIdx}>
                  {page.map((font, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedFont(font.name);
                        onChangeFontFamily(font);
                      }}
                      className="flex justify-between hover:bg-[#e2e8f0] p-1 rounded-sm cursor-pointer"
                    >
                      <span style={{ fontFamily: font.name }}>{font.name}</span>
                      {font.name === selectedFont && <Check size={18} />}
                    </div>
                  ))}
                </div>
              ))}
              <div
                ref={ref}
                className="flex flex-col justify-center items-center"
              >
                {!hasNextPage && <p>Nothing more to load</p>}
              </div>
            </div>
            {isFetchingNextPage && hasNextPage && <Loading color="#e2e8f0" />}
          </div>
        }
        trigger="click"
        arrow={false}
      >
        <Toggle size="sm">
          <Tooltip content="Font" className="mb-2">
            {selectedFont ? (
              <span style={{ fontFamily: selectedFont }}>{selectedFont}</span>
            ) : (
              <TextT size={18} />
            )}
          </Tooltip>
        </Toggle>
      </Popover>
    </div>
  );
};

export default FontFamilyTiptap;
