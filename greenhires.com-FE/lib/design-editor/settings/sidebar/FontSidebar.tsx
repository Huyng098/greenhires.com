"use client";
import { Loading } from "@/components/Common/Loading";
import { FONTS_KEY } from "@/constants/query_key";
import useInfinityScroll from "@/lib/hooks/useInfinityScroll";
import CheckIcon from "@duyank/icons/regular/Check";
import MagnifyingGlassIcon from "@duyank/icons/regular/MagnifyingGlass";
import XIcon from "@duyank/icons/regular/X";
import { FontData } from "@lidojs/design-core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditorContext } from "../../editor/EditorContext";
import { useEditor } from "../../hooks";
import { useUsedFont } from "../../layers/hooks/useUsedFont";
import FontStyle from "./FontStyle";
import Sidebar, { SidebarProps } from "./Sidebar";

interface FontSidebarProps extends SidebarProps {
  selected: FontData[];
  onChangeFontFamily: (font: FontData) => void;
}

const FontSidebar: ForwardRefRenderFunction<
  HTMLDivElement,
  FontSidebarProps
> = ({ selected, onChangeFontFamily, ...props }, ref) => {
  const qRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getFonts } = useContext(EditorContext);
  const { usedFonts } = useUsedFont();
  const { actions, fontList } = useEditor((state) => ({
    fontList: state.fontList,
  }));
  const [keyword, setKeyword] = useState("");

  const { data, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [FONTS_KEY, keyword],
      queryFn: async ({ pageParam }) => {
        return await getFonts({
          limit: 30 + "",
          offset: fontList.length + pageParam + "",
          q: keyword,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 0 ? undefined : allPages.length,
    });
  const observerElemRef = useInfinityScroll(fetchNextPage, hasNextPage);
  useEffect(() => {
    if (data?.pages) {
      actions.setFontList(data.pages.flat());
    }
  }, [data]);
  const debouncedSetKeyword = useCallback(
    debounce((value) => {
      setKeyword(value);
    }, 500),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSetKeyword(e.target.value);
  };
  return (
    <Sidebar ref={ref} {...props}>
      <FontStyle />
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            height: 48,
            borderBottom: "1px solid rgba(57,76,96,.15)",
            padding: "0 20px",
          }}
        >
          <p
            style={{
              lineHeight: "48px",
              fontWeight: 600,
              color: "#181C32",
              flexGrow: 1,
            }}
          >
            Font
          </p>
          <div
            style={{
              fontSize: 20,
              flexShrink: 0,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              actions.setSidebar();
            }}
          >
            <XIcon />
          </div>
        </div>
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
          <div style={{ padding: "16px 20px", fontWeight: 700 }}>
            Document fonts
          </div>
          {usedFonts.map((font, idx) => (
            <div
              key={idx}
              className="hover:bg-[#F9F9F9]"
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                padding: "0 24px",
              }}
              onClick={() => onChangeFontFamily(font)}
            >
              <span
                style={{
                  fontFamily: font.name,
                }}
              >
                {font.name}
              </span>
              {selected.map((s) => s.name).includes(font.name) && (
                <span>
                  <CheckIcon />
                </span>
              )}
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(217, 219, 228, 0.6)" }}>
            <div style={{ padding: "16px 20px", fontWeight: 700 }}>Fonts</div>
            {fontList.map((font, idx) => (
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
                onClick={() => onChangeFontFamily(font)}
              >
                <span style={{ fontFamily: font.name }}>{font.name}</span>
                {selected.map((s) => s.name).includes(font.name) && (
                  <span>
                    <CheckIcon />
                  </span>
                )}
              </div>
            ))}
            {isFetching && <Loading color="#2f566b" />}
          </div>
          <div
            ref={observerElemRef}
            className="flex justify-center items-center"
          >
            {isFetchingNextPage && hasNextPage ? (
              <Loading color="#FFFFFF" />
            ) : (
              !isFetching && <p className="text-white">Nothing more to load</p>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default forwardRef<HTMLDivElement, FontSidebarProps>(FontSidebar);
