import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useEditor } from "../hooks";

import { Button } from "@/components/ui/button";
import { SavingContext } from "@/stores/saving";
import { ArrowsOut, CloudCheck, CloudWarning } from "@phosphor-icons/react";
import { useContext } from "react";
import { PageScaleHandler } from "./PageScaleHandler";

interface PageControlLiveEditProps {
  openPreview: () => void;
  clickToPage: (page: number) => void;
}

const PageControlLiveEdit = ({
  openPreview,
  clickToPage,
}: PageControlLiveEditProps) => {
  const { actions, activePage, totalPages } = useEditor((state) => ({
    activePage: state.activePage,
    totalPages: state.pages.length,
    scale: state.scale,
  }));
  const { saving } = useContext(SavingContext);

  return (
    <div className="flex relative items-center justify-between text-white px-2 h-full bg-slate-600 font-medium">
      {saving ? (
        <CloudWarning size={30} weight="regular" />
      ) : (
        <CloudCheck size={30} weight="regular" />
      )}
      <div className="absolute m-auto left-0 right-0 flex flex-1 justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => clickToPage(activePage - 1)}
          disabled={activePage === 0}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        {activePage + 1} / {totalPages}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full "
          onClick={() => clickToPage(activePage + 1)}
          disabled={activePage === totalPages - 1}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute right-2 flex gap-2 items-center">
        <PageScaleHandler />
        <button className="hover:text-secondary-main" onClick={openPreview}>
          <ArrowsOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default PageControlLiveEdit;
