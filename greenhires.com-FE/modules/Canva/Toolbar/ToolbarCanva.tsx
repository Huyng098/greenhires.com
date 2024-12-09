import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useExport } from "@/lib/hooks/useExport";
import { SharingSection } from "@/modules/Builder/Sharing";
import { useResumeStore } from "@/stores/resume";
import { SavingContext } from "@/stores/saving";
import { useEditor } from "@lidojs/design-editor";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CloudCheck,
  CloudWarning,
  FileArrowDown,
  Share,
} from "@phosphor-icons/react";
import { useContext, useState } from "react";

export default function ToolbarCanva() {
  const { actions } = useEditor((state) => ({
    rootLayer:
      state.pages[state.activePage] &&
      state.pages[state.activePage].layers.ROOT,
    activePage: state.activePage,
    scale: state.scale,
  }));
  const { saving } = useContext(SavingContext);
  const [isDownloading, setIsDownloading] = useState(false);
  const resume_id = useResumeStore()((state) => state.resume.id);
  const resume_name = useResumeStore()((state) => state.resume.title);
  const setResume = useResumeStore()((state) => state.setResume);
  const { onExportToPDF } = useExport(resume_id, setIsDownloading);
  return (
    <div className="p-2 flex gap-5 bg-backgroundColor-main w-full">
      <div className="flex justify-start border-r">
        <Button
          variant={"ghost"}
          onClick={(e) => {
            actions.history.undo();
            e.preventDefault();
          }}
        >
          <ArrowCounterClockwise size={26} weight="thin" />
        </Button>
        <Button
          variant={"ghost"}
          onClick={(e) => {
            actions.history.redo();
            e.preventDefault();
          }}
        >
          <ArrowClockwise size={26} weight="thin" />
        </Button>
      </div>
      <div className="flex gap-2 justify-center items-center">
        {saving ? (
          <>
            <CloudWarning size={26} weight="light" />
            <p>Unsave</p>
          </>
        ) : (
          <>
            <CloudCheck size={26} weight="light" />
            <p>Saved</p>
          </>
        )}
      </div>
      <div className="w-full flex justify-end gap-4">
        <Input
          onChange={(e) => setResume("title", e.target.value)}
          value={resume_name}
          className="w-1/4 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Popover>
          <PopoverTrigger>
            <div className="hover:text-secondary-main flex gap-2 items-center justify-center">
              <Share size={26} weight="thin" />
              <p>Share</p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[450px]">
            <SharingSection />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <div className="border border-secondary-main rounded p-[5px] flex items-center gap-2 justify-center hover:text-secondary-main">
              <FileArrowDown size={28} weight="light" />
              <p>Download</p>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2 justify-center items-center">
              <p className="text-xs"> Do you want to download CV as PDF ? </p>
              <Button
                disabled={isDownloading}
                className=" bg-primary-main"
                onClick={onExportToPDF}
              >
                Download
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
