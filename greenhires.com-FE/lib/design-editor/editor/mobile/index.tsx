import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalStyle } from "@lidojs/design-layers";
import {
  ArrowBendUpLeft,
  DotsThree,
  DownloadSimple,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { useEditor } from "../../hooks";
import { useUsedFont } from "../../layers/hooks/useUsedFont";
import Page from "../Page";
import useDevices from "@/lib/hooks/useDevices";

type Interval = ReturnType<typeof setTimeout>;
let timeout: Interval;
interface PreviewProps {
  onClose: () => void;
}
const PreviewMobile = ({ onClose }: PreviewProps) => {
  const { isDesktop } = useDevices();
  const { pages, pageSize } = useEditor((state, query) => ({
    pages: state.pages,
    pageSize: query.getPageSize(),
  }));
  const [activeSlide, setActiveSlide] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0, scale: 1 });
  const { usedFonts } = useUsedFont();
  const moveSlide = useCallback(
    (number: number) => {
      setActiveSlide((prevState) => {
        const value = (prevState + number) % pages.length;
        if (value >= 0) {
          return value;
        } else {
          return pages.length + value;
        }
      });
    },
    [setActiveSlide, pages.length]
  );
  useEffect(() => {
    timeout = setTimeout(() => {
      moveSlide(1);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [moveSlide, activeSlide]);

  useEffect(() => {
    const updateSize = () => {
      const { clientWidth, clientHeight } = window.document.body;
      const ratio = clientWidth / clientHeight;
      const pageRatio = pageSize.width / pageSize.height;
      if (ratio > pageRatio) {
        const w = clientHeight * pageRatio;
        setSize({
          width: w,
          height: clientHeight,
          scale: w / pageSize.width,
        });
      } else {
        const w = clientWidth;
        const h = w / pageRatio;
        setSize({
          width: w,
          height: h,
          scale: w / pageSize.width,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [pageSize]);

  if (size.width === 0) {
    return null;
  }

  return (
    <>
      <GlobalStyle fonts={usedFonts} />

      <div className="flex flex-col items-center ">
        <div
          className={`ml-2 ${!isDesktop && "flex justify-between items-center gap-2 mr-2 w-full mt-2"}`}
        >
          <Button
            className="bg-white text-primary-main hover:bg-gray-500  mx-2"
            onClick={() => onClose()}
          >
            <ArrowBendUpLeft size={26} />
            {isDesktop && "Back to editor"}
          </Button>
          <div className="flex gap-2">
              <Button className="bg-primary-main w-fit gap-4">
                <DownloadSimple size={26} />
                {isDesktop && "Download PDF"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="bg-primary-main">
                    <DotsThree size={26} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{ zIndex: "1070" }}>
                  <DropdownMenuItem>Export to TXT</DropdownMenuItem>
                  <DropdownMenuItem>Export to DOCX</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-row justify-around w-full mt-5">
          <div className="flex flex-col gap-8">
            {pages.map((page, index) => (
              <Page
                height={pageSize.height}
                isActive={true}
                pageIndex={index}
                scale={size.scale * 0.85}
                width={pageSize.width}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewMobile;
