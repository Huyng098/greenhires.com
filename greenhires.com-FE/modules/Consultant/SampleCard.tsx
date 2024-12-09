import { Category } from "@/interfaces/general/category";
import { SampleDto } from "@/interfaces/sample/sample";
import { SamplePreview } from "@/lib/design-screen/screen/SamplePreview";
import { useExport } from "@/lib/hooks/useExport";
import { DropdownMenuCRUDResume } from "@/modules/Builder/Resume/DropdownMenuCRUD";

import {
  useChangeSampleStatus,
  useDeleteSample,
  useDuplicateSample,
} from "@/services/sample/query";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";

import { DotsThree } from "@phosphor-icons/react";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { BaseCard } from "../Dashboard/Resumes/_components/base-card";
import { DuplicateDialogTitle } from "../Template/DuplicateTitleDialog";
import { ChooseCategoryDialog } from "./ChooseCategoryDialog";
import humanizeString from "humanize-string";
import { TEMPLATE_LAYOUT } from "@/constants/dashboard";

const status_color = {
  approved: {
    bg_color: "#d0f4ff",
    text_color: "#093e8c",
    text: "Approved",
  },
  waiting: {
    bg_color: "#fbf5c4",
    text_color: "#8b5401",
    text: "Waiting",
  },
  rejected: {
    bg_color: "#ffe3e3",
    text_color: "#8c0909",
    text: "Rejected",
  },
};
interface SampleCardProps {
  sample: SampleDto;
  categorize?: boolean;
  categories: Category[];
}
dayjs.extend(relativeTime);

const SubmitDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);

export const SampleCard = ({
  sample,
  categorize,
  categories,
}: SampleCardProps) => {
  const router = useRouter();
  const onEdit = () => {
    NProgress.start();
    const route = sample.type === TEMPLATE_LAYOUT ? TEMPLATE_LAYOUT : "canva";
    router.push(`/consultant/${route}/${sample.id}/edit-sample`);
  };
  const [openDuplicate, setOpenDuplicate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { onExportToPDF } = useExport(sample.id, setIsDownloading, "sample");
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>(
    sample.category_ids || []
  );
  const [openTooltip, setOpenTooltip] = useState(false);
  const { changeSampleStatus, isSubmitting } = useChangeSampleStatus();
  const { deleteSampleById } = useDeleteSample();
  const onDelete = async () => {
    try {
      deleteSampleById(sample.id);
      router.refresh();
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (openTooltip) {
      timeoutId = setTimeout(() => {
        setOpenTooltip(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [openTooltip]);
  const handleOpenSubmit = () => {
    if (categoriesSelected.length === 0) {
      setOpenTooltip(true);
      return;
    }
    setOpenSubmitDialog(true);
  };
  const handleTagChange = (category_ids: string[]) => {
    setCategoriesSelected(category_ids);
    changeSampleStatus({
      id: sample.id,
      category_ids: category_ids,
    });
  };

  const handleSubmit = () => {
    changeSampleStatus({
      id: sample.id,
      status: "waiting",
      category_ids: categoriesSelected ? categoriesSelected : undefined,
      comment: undefined,
    });
    setOpenSubmitDialog(false);
  };

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      color: "#E37070",
      backgroundColor: "white",
      border: "1px solid #E37070",
    },
    [`& .${tooltipClasses.arrow}`]: {
      "&:before": {
        border: "1px solid #E37070",
        background: "white",
      },
    },
  }));

  const [baseCardWidth, setBaseCardWidth] = useState<number | null>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const { duplicateSampleById } = useDuplicateSample();

  const onDuplicate = async (name: string) => {
    try {
      duplicateSampleById({ sample_id: sample.id, name });
    } catch (error) {
      console.log("error", error);
    }
  };
  const selectedNames = useMemo(() => {
    return categoriesSelected
      .map((id) => categories.find((category) => category.id === id)?.name)
      .join(", ");
  }, [categoriesSelected]);

  useEffect(() => {
    if (baseRef.current) {
      setBaseCardWidth(baseRef.current.offsetWidth);
    }
  }, [baseRef.current]);
  return (
    <Fragment>
      <BaseCard ref={baseRef}>
        {categorize && (
          <div className="relative">
            <div className="flex gap-10 items-center absolute z-10 top-[5px] right-[-100px]">
              {sample.status === "pending" && !selectedNames ? (
                <ChooseCategoryDialog
                  categories={categories}
                  defaultCategories={sample.category_ids}
                  action={handleTagChange}
                >
                  <CustomTooltip
                    title="You have not classified this sample yet"
                    arrow
                    open={openTooltip}
                  >
                    <IconButton>
                      <LocalOfferIcon
                        sx={{
                          color: "#2F566B",
                          transform: "scaleX(-1)",
                        }}
                      />
                    </IconButton>
                  </CustomTooltip>
                </ChooseCategoryDialog>
              ) : sample.status === "pending" ||
                sample.status === "rejected" ? (
                <ChooseCategoryDialog
                  categories={categories}
                  defaultCategories={sample.category_ids}
                  action={handleTagChange}
                >
                  <Tooltip placement="top" title={selectedNames}>
                    <div className="cursor-pointer w-16 flex items-center p-[2px] bg-gray-300 shadow-lg rounded h-6 text-xs">
                      <p className="line-clamp-1">{selectedNames}</p>
                    </div>
                  </Tooltip>
                </ChooseCategoryDialog>
              ) : (
                <Tooltip placement="top" title={selectedNames}>
                  <div className="w-16 flex items-center p-[2px] bg-gray-300 rounded h-6 text-xs">
                    <p className="line-clamp-1">{selectedNames}</p>
                  </div>
                </Tooltip>
              )}
              <button
                style={{
                  backgroundColor:
                    status_color[sample.status as keyof typeof status_color]
                      ?.bg_color,
                  color:
                    status_color[sample.status as keyof typeof status_color]
                      ?.text_color,
                }}
                onClick={handleOpenSubmit}
                disabled={sample.status !== "pending" || isSubmitting}
                className={`${sample.status === "pending" && "bg-[#828282b3] text-white hover:bg-[#565656]"} w-fit px-[12px] py-[6px] rounded z-10`}
              >
                {sample.status !== "pending"
                  ? status_color[sample.status as keyof typeof status_color]
                      .text
                  : "Submit"}
              </button>
            </div>
          </div>
        )}
        <SamplePreview
          data={sample.elements}
          width={794}
          height={1123}
          scale={(baseCardWidth || 317) / 794}
        />
        <div
          className={classNames(
            "absolute inset-x-0 bottom-0 md:z-10 flex items-center justify-between space-y-0.5 p-4 pt-12",
            "rounded-md bg-gradient-to-t from-black/50 to-transparent text-white"
          )}
        >
          <div>
            <h4 className="line-clamp-1 font-base">{sample.name}</h4>
            <p className="line-clamp-1 text-xs opacity-75">{`Updated ${dayjs(sample.updated_at).fromNow()}`}</p>
          </div>
          <div className="flex self-end items-center ml-1">
            <DropdownMenuCRUDResume
              status={sample.status}
              onEdit={
                sample.status === "pending" || sample.status === "rejected"
                  ? () => onEdit()
                  : undefined
              }
              onDuplicate={setOpenDuplicate}
              onExportToPDF={onExportToPDF}
              onDelete={onDelete}
              type={sample.type}
              isDownloading={isDownloading}
            >
              <div className="ml-auto cursor-pointer">
                <DotsThree size={30} color="white" weight="bold" />
              </div>
            </DropdownMenuCRUDResume>
          </div>
        </div>
      </BaseCard>
      {openSubmitDialog && (
        <SubmitDialog
          title={`Are you sure you want to submit this ${sample.type}?`}
          description="This action cannot be undone, it will be permanently submitted."
          cancelText="Cancel"
          confirmText="Submit"
          open={openSubmitDialog}
          setOpen={setOpenSubmitDialog}
          handleConfirm={handleSubmit}
          confirmButtonColor="bg-primary-main hover:bg-primary-main/85"
        />
      )}
      <DuplicateDialogTitle
        title={humanizeString(sample.type)}
        open={openDuplicate}
        setOpen={setOpenDuplicate}
        old_title={sample.name}
        handleSubmit={onDuplicate}
      />
    </Fragment>
  );
};
