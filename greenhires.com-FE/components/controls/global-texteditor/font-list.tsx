"use client";
import { Loading } from "@/components/Common/Loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FONTS_KEY } from "@/constants/query_key";
import useInfinityScroll from "@/lib/hooks/useInfinityScroll";
import { getAllTextFont } from "@/services/canva";
import CheckIcon from "@duyank/icons/regular/Check";
import MagnifyingGlassIcon from "@duyank/icons/regular/MagnifyingGlass";
import { FontData } from "@lidojs/design-core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import qs from "query-string";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  selected: FontData[];
  setSelected: (fonts: FontData[]) => void;
  setFontList: (fonts: FontData[]) => void;
  onChangeFontFamily: (font: FontData) => void;
  children: React.ReactNode;
}

export const FontFamilyTiptap = ({
  selected,
  setSelected,
  onChangeFontFamily,
  setFontList,
  children,
}: Props) => {
  const qRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");

  const { data, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [FONTS_KEY, keyword],
      queryFn: async ({ pageParam }) => {
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
        lastPage.length === 0 ? undefined : allPages.length,
    });
  const observerElemRef = useInfinityScroll(fetchNextPage, hasNextPage);

  const debouncedSetKeyword = useCallback(
    debounce((value) => {
      setKeyword(value);
    }, 500),
    []
  );
  useEffect(() => {
    if (data?.pages) setFontList(data.pages.flat());
  }, [data]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSetKeyword(e.target.value);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="p-0 h-96 overflow-auto">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              borderRadius: 4,
              boxShadow: "0 0 0 1px rgba(43,59,74,.3)",
              margin: 16,
            }}
          >
            <div
              style={{
                height: 40,
                borderRadius: 4,
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 24, marginRight: 8, flexShrink: 0 }}>
                <MagnifyingGlassIcon />
              </div>

              <input
                onChange={handleChange}
                ref={qRef}
                style={{ width: "100%", height: "100%" }}
                type={"text"}
              />
            </div>
          </div>
          <div ref={scrollRef} style={{ flexGrow: 1, overflowY: "auto" }}>
            <div style={{ borderTop: "1px solid rgba(217, 219, 228, 0.6)" }}>
              <div style={{ padding: "16px 20px", fontWeight: 700 }}>Fonts</div>
              {data?.pages.map((page, pageIdx) => (
                <div key={pageIdx}>
                  {page.map((font, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F9F9F9]"
                      style={{
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        padding: "0 24px",
                      }}
                      onClick={() => {
                        setSelected([font, ...selected]);
                        onChangeFontFamily(font);
                      }}
                    >
                      <span style={{ fontFamily: font.name }}>{font.name}</span>
                      {selected.map((s) => s.name).includes(font.name) && (
                        <span>
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {isFetching && <Loading color="#2f566b" />}
            </div>
            <div
              ref={observerElemRef}
              className="flex flex-col justify-center items-center"
            >
              {isFetchingNextPage && hasNextPage ? (
                <Loading color="#FFFFFF" />
              ) : (
                !isFetching && <p>Nothing more to load</p>
              )}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
