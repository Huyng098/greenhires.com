"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@/interfaces/general/category";
import { useEditor } from "@/lib/design-editor";
import { SampleActionCanva } from "@/modules/Template/SampleActionCanva";
import { useSample } from "@/services/template/query";
import { Plus, SkipBack } from "@phosphor-icons/react";
import classNames from "classnames";
import Image from "next/image";
import { useMemo, useState } from "react";

interface SampleContentProps {
  categories: Category[];
  type: "Layout" | "Template";
}

interface SampleCardProps {
  img: string;
  handleApplyPage: () => void;
}

const SampleCard = ({ img, handleApplyPage }: SampleCardProps) => {
  const [isHover, setIsHover] = useState(false);
  const onEnter = () => setIsHover(true);
  const onLeave = () => setIsHover(false);

  return (
    <div
      onClick={() => handleApplyPage()}
      key={img}
      className="relative w-[158px]"
    >
      <Image
        loading="lazy"
        alt={`${img}`}
        className="rounded"
        width={158}
        height={224}
        src={`${img}?cache=${new Date().getTime()}`}
      />
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={classNames(
          "rounded flex items-center justify-center inset-0 bg-black bg-opacity-50 transition-opacity duration-100 absolute",
          isHover ? "opacity-100 cursor-pointer" : "opacity-0"
        )}
      >
        <Plus size={25} color="white" weight="bold" />
      </div>
    </div>
  );
};
export const SampleContent = ({ categories, type }: SampleContentProps) => {
  const [open, onOpenChange] = useState(false);
  const { actions, activePage } = useEditor((state) => ({
    activePage: state.activePage,
  }));

  const [selectedId, setSelectedId] = useState("");
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const { data } = useSample(selectedId, type);

  const handleApplyPage = (page: number, idx: number) => {
    if (!data) return;
    if (page === activePage) {
      actions.setPage(page, data.resume_canva[idx]);
    } else {
      actions.addPage();
      actions.setPage(page, data.resume_canva[idx]);
    }
    onOpenChange(!open);
  };
  const isOnlyOnePage = useMemo(() => {
    if (data?.variants[0]?.imgs.length === 1) {
      onOpenChange(!open);
      return true;
    }
    return false;
  }, [data]);

  return (
    <>
      {!selectedId || isOnlyOnePage ? (
        <SampleActionCanva
          categories={categories}
          type={type}
          handleSelectSample={(id) => {
            if (isOnlyOnePage && selectedId === id) onOpenChange(!open);
            else setSelectedId(id);
          }}
        >
          <p className="text-md text-white font-medium"> Switch {type}</p>
        </SampleActionCanva>
      ) : (
        <>
          <Button
            onClick={() => setSelectedId("")}
            className="bg-primary-main cursor-pointer flex items-center justify-center text-white gap-2"
          >
            <SkipBack size={20} weight="light" />
            <p>Back</p>
          </Button>
          <div className="grid grid-cols-2 p-2">
            {data?.variants[0].imgs.map((img, idx) => (
              <SampleCard
                key={img}
                img={img}
                handleApplyPage={() => {
                  setSelectedPageIdx(idx);
                  onOpenChange(!open);
                }}
              />
            ))}
          </div>
        </>
      )}

      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add {type} as new page?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => handleApplyPage(activePage, selectedPageIdx)}
                className="bg-white text-dark hover:bg-gray-100"
              >
                Replace current page
              </Button>
              <Button
                onClick={() => handleApplyPage(activePage + 1, selectedPageIdx)}
                className="bg-primary-main text-white"
              >
                Add as new page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
