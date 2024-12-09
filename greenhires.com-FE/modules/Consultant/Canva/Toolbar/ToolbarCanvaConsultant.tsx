import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Category } from "@/interfaces/general/category";
import { SampleDto } from "@/interfaces/sample/sample";
import SettingButton from "@/lib/design-editor/settings/SettingButton";
import { useExport } from "@/lib/hooks/useExport";
import {
  useChangeSampleStatus,
  useUpdateSample,
} from "@/services/sample/query";
import { SavingContext } from "@/stores/saving";
import { useEditor } from "@lidojs/design-editor";
import { Badge } from "@mui/material";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowSquareOut,
  Article,
  CloudCheck,
  CloudWarning,
  FileArrowDown,
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { ChooseCategoryDialog } from "../../ChooseCategoryDialog";
import SetMainColorMenu from "../SetMainColorMenu";

interface Props {
  categories: Category[];
  sample: SampleDto;
}

export default function ToolbarCanvaConsultant({ categories, sample }: Props) {
  const { actions, query } = useEditor((state, query) => ({
    rootLayer:
      state.pages[state.activePage] &&
      state.pages[state.activePage].layers.ROOT,
    activePage: state.activePage,
    scale: state.scale,
  }));
  const { saving } = useContext(SavingContext);
  const [isDownloading, setIsDownloading] = useState(false);
  const { changeSampleStatus, isSubmitting } = useChangeSampleStatus();
  const { onExportToPDF } = useExport(sample.id, setIsDownloading, "sample");
  const [openSetMainColorSetting, setOpenSetMainColorSetting] = useState(false);
  const { updateSampleById } = useUpdateSample();

  const handleSubmitAgain = (curr: string[] = []) => {
    if (sample.category_ids.length === 0 && curr.length === 0) return;
    try {
      changeSampleStatus({
        id: sample.id,
        status: "waiting",
        category_ids:
          sample.category_ids.length > 0 ? sample.category_ids : curr,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const [sampleName, setSampleName] = useState(sample.name);
  const changeNameSample = (name: string) => {
    try {
      updateSampleById({
        id: sample.id,
        name: name,
      });
    } catch (err) {
      console.log(err);
    }
  };
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
        <SettingButton onClick={() => setOpenSetMainColorSetting(true)}>
          <span style={{ padding: "0 4px" }}>Select theme</span>
        </SettingButton>
      </div>
      {openSetMainColorSetting && (
        <div className="fixed inset-0 bg-primary-main z-[9999]">
          <SetMainColorMenu
            canvaData={query.serialize()}
            closeMenu={() => setOpenSetMainColorSetting(false)}
            sample_id={sample.id}
            variants={sample.variants}
          />
        </div>
      )}

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
          onBlur={() => {
            if (sample.name !== sampleName) {
              changeNameSample(sampleName);
            }
          }}
          onChange={(e) => setSampleName(e.target.value)}
          value={sampleName}
          placeholder="Enter your resume name"
          className="w-1/4 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button
          onClick={onExportToPDF}
          disabled={isDownloading}
          className="bg-primary-main hover:bg-primary-main/85 flex gap-2"
        >
          <FileArrowDown size={28} weight="light" />
          <p>Download</p>
        </Button>

        {sample.category_ids && sample.category_ids.length > 0 ? (
          <Button
            disabled={isSubmitting}
            onClick={() => handleSubmitAgain()}
            className="bg-primary-main hover:bg-primary-main/85 flex gap-3"
          >
            <ArrowSquareOut size={28} weight="thin" />
            <p>Submit</p>
          </Button>
        ) : (
          <ChooseCategoryDialog
            text="Submit"
            defaultCategories={sample.category_ids || []}
            categories={categories}
            action={(categoriesSelected) => {
              handleSubmitAgain(categoriesSelected);
            }}
          >
            <Button className="bg-primary-main hover:bg-primary-main/85 flex gap-3">
              <ArrowSquareOut size={28} weight="thin" />
              <p>Submit</p>
            </Button>
          </ChooseCategoryDialog>
        )}
      </div>

      {sample.comments && sample.comments.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              variant="standard"
              badgeContent={sample.comments.length || null}
              invisible={false}
              sx={{
                mr: "10px",
                cursor: "pointer",
                "& .MuiBadge-badge": {
                  backgroundColor: "#FF0000",
                  right: "8px",
                  top: "8px",
                  width: "16px",
                  height: "16px",
                  color: "#fff",
                  minWidth: "16px",
                  fontSize: "0.8rem",
                },
              }}
            >
              <Article size={30} weight="light" />
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-200 rounded-md p-3 shadow-sm">
            {sample.comments.map((item, index) => (
              <div key={index} className="bg-white rounded mb-2 p-2">
                <div key={index} className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {dayjs(item.time).format("HH:MM DD/MM/YYYY")}, by{" "}
                    {item.admin_name}:
                  </p>
                </div>
                <div className="text-sm ml-3">{item.content}</div>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
