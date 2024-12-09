import { categoryTemplate, statusTemplate } from "@/constants/filter";
import { ResumeDto } from "@/interfaces/builder/resume";
import { SamplePreview } from "@/lib/design-screen/screen/SamplePreview";
import { useExport } from "@/lib/hooks/useExport";
import { DropdownMenuCRUDResume } from "@/modules/Builder/Resume/DropdownMenuCRUD";
import { DuplicateDialogTitle } from "@/modules/Template/DuplicateTitleDialog";
import { useDeleteResume, useDuplicateResume } from "@/services/resume/query";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";

import { CircleNotch, DotsThree } from "@phosphor-icons/react";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BaseCard } from "./base-card";
interface ResumeCardProps {
  resume: ResumeDto;
  categorize?: boolean;
}
dayjs.extend(relativeTime);
export const ResumeCard = ({ resume, categorize }: ResumeCardProps) => {
  const router = useRouter();
  const onEdit = () => {
    NProgress.start();
    if (resume.builder_type === "resumeio") {
      router.push(`/resume/${resume.id}/edit`);
    } else {
      router.push(`/canva/${resume.id}/edit`);
    }
  };
  const [isDownloading, setIsDownloading] = useState(false);
  const { onExportToPDF, onExportToDOCX, onExportToTXT } = useExport(
    resume.id,
    setIsDownloading
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [submited, setSubmited] = useState(false);
  const [categorySelected, setCategorySelected] = useState<string | null>(null);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDuplicate, setOpenDuplicate] = useState(false);
  const { deleteCV } = useDeleteResume();
  const { duplicateCV } = useDuplicateResume();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectCategory = (value: string) => {
    setCategorySelected(value);
    setAnchorEl(null);
  };
  const onDuplicate = async (title: string) => {
    try {
      await duplicateCV({ resume_id: resume.id, title: title });
    } catch (error) {
      console.log("error", error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteCV(resume.id);
      toast.success("Delete resume successfully!");
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
  const handleSubmit = () => {
    if (!categorySelected) {
      setOpenTooltip(true);
      return;
    }
    setSubmited(true);
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
  useEffect(() => {
    if (baseRef.current) {
      setBaseCardWidth(baseRef.current.offsetWidth);
    }
  }, [baseRef.current]);
  return (
    <Fragment>
      <BaseCard ref={baseRef}>
        <AnimatePresence presenceAffectsLayout>
          {categorize && (
            <button
              onClick={handleSubmit}
              className={`absolute top-[10px] right-[10px] ${submited ? `bg-[#FBF5C4] text-[#8B5401] hover:bg-[#FBF5C4]` : "bg-[#828282b3] text-white hover:bg-[#565656]"} w-fit px-[12px] py-[6px]  rounded `}
            >
              {submited ? statusTemplate[1].value : "Submit"}
            </button>
          )}
          {!baseCardWidth ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CircleNotch
                size={64}
                weight="thin"
                opacity={0.5}
                className="animate-spin self-center justify-self-center"
              />
            </motion.div>
          ) : (
            <div onClick={() => onEdit()}>
              <SamplePreview
                data={resume.resume_canva}
                width={794}
                height={1123}
                scale={baseCardWidth / 794}
              />
            </div>
          )}
        </AnimatePresence>
        <div
          className={classNames(
            "absolute inset-x-0 bottom-0 md:z-10 flex items-center justify-between space-y-0.5 p-4 pt-12",
            "rounded-md bg-gradient-to-t from-black/50 to-transparent text-white"
          )}
        >
          <div>
            <h4 className="line-clamp-1 font-base">{resume.title}</h4>
            <p className="line-clamp-1 text-xs opacity-75">{`Updated ${dayjs(resume.updated_at).fromNow()}`}</p>
          </div>
          <div className="flex self-end items-center ml-1">
            {categorize && (
              <div>
                {categorySelected ? (
                  <Button
                    sx={{
                      fontWeight: 400,
                      fontSize: "8px",
                      color: "black",
                      bgcolor: "white",
                      width: "fit-content",
                      whiteSpace: "nowrap",
                      p: "2px",
                      textTransform: "none",
                      height: "20px",
                      "&:hover": {
                        color: "black",
                        bgcolor: "white",
                      },
                    }}
                    onClick={handleClick}
                  >
                    {categorySelected}
                  </Button>
                ) : (
                  <div onClick={handleClick}>
                    <CustomTooltip
                      title="You have not classified this resume yet"
                      arrow
                      open={openTooltip}
                    >
                      <IconButton>
                        <LocalOfferIcon
                          sx={{ color: "#2F566B", transform: "scaleX(-1)" }}
                        />
                      </IconButton>
                    </CustomTooltip>
                  </div>
                )}
              </div>
            )}
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  width: "100%",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Category
              </Typography>

              {categoryTemplate?.map((item) => {
                if (item.id !== 0) {
                  return (
                    <MenuItem
                      key={item.id}
                      sx={{ justifyContent: "center", fontSize: "10px" }}
                      onClick={() => handleSelectCategory(item.value)}
                    >
                      {item.value}
                    </MenuItem>
                  );
                }
              })}
            </Menu>

            <DropdownMenuCRUDResume
              onEdit={onEdit}
              onDuplicate={setOpenDuplicate}
              onExportToPDF={onExportToPDF}
              onExportToDOCX={onExportToDOCX}
              onExportToTXT={onExportToTXT}
              onDelete={onDelete}
              isDownloading={isDownloading}
            >
              <div className="ml-auto cursor-pointer">
                <DotsThree size={30} color="white" weight="bold" />
              </div>
            </DropdownMenuCRUDResume>
          </div>
        </div>
      </BaseCard>
      <DuplicateDialogTitle
        title="resume"
        open={openDuplicate}
        setOpen={setOpenDuplicate}
        old_title={resume.title}
        handleSubmit={onDuplicate}
      />
    </Fragment>
  );
};
