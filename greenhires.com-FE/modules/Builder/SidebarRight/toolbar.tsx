"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useEditor } from "@/lib/design-editor";
import useDevices from "@/lib/hooks/useDevices";
import { useExport } from "@/lib/hooks/useExport";
import PreviewModal from "@/modules/Canva/Editor/PreviewModal";
import { uploadImage } from "@/services/general/api";
import { useBuilderStore } from "@/stores/builder";
import { useResumeStore } from "@/stores/resume";
import {
  Download,
  Files,
  SelectionBackground,
  Shapes,
  Swap,
  Upload,
  Layout,
  PaintBrushBroad,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { ImEnlarge } from "react-icons/im";
import { ResumeNotification } from "../Panel/ResumeNotification";
import { AICheckResume } from "./ai-check";
import { DropdownMenuExport } from "./dropdown-export";

export const ToolbarPDF = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resume_id = useResumeStore()((state) => state.resume?.id);
  const isSample = useResumeStore()((state) => state.resume?.isSample);
  const { workspace } = useBuilderStore()();
  const [openPreview, setOpenPreview] = useState(false);
  const { isDesktop } = useDevices();
  const [isDoing, setIsDoing] = useState(false);
  const { onExportToPDF, onExportToDOCX, onExportToTXT } = useExport(
    resume_id,
    setIsDoing
  );
  const [isUploading, setIsUploading] = useState(false);
  const { actions } = useEditor((state) => state);
  const handleUploadToPage = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "general");
    try {
      const res = await uploadImage(formData);
      const newImage = new Image();
      newImage.onerror = (err) => window.alert(err);
      newImage.src = res.url;
      newImage.crossOrigin = "anonymous";
      console.log(newImage);
      newImage.onload = () => {
        actions.addImageLayer(
          { url: res.url, thumb: res.url },
          { width: newImage.naturalWidth, height: newImage.naturalHeight }
        );
      };
    } catch (e) {
      window.alert("Cannot upload image: " + (e as Error).message);
    }
    setIsUploading(false);
  };
  return (
    <>
      <div className="flex items-center flex-col gap-20">
        <div className="relative mt-2">
          <ResumeNotification />
          <AICheckResume isDoing={isDoing} setIsDoing={setIsDoing} />
        </div>
        <div className={`flex flex-col gap-5 justify-center p-2 items-center `}>
          <Tooltip content="Shape">
            <Button
              onClick={() => workspace.setIsApply("shape")}
              size="icon"
              className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
            >
              <Shapes size={32} />
            </Button>
          </Tooltip>
          <Tooltip content="Upload image">
            <Button
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              size="icon"
              className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
            >
              <Upload size={32} />
            </Button>
          </Tooltip>

          <Tooltip content="Change background">
            <Button
              onClick={() => workspace.setIsApply("background")}
              size="icon"
              className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
            >
              <SelectionBackground size={32} />
            </Button>
          </Tooltip>
          {!isSample && (
            <Tooltip content="Change template">
              <Button
                onClick={() => workspace.setIsApply("template")}
                size="icon"
                className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
              >
                <Files size={32} />
              </Button>
            </Tooltip>
          )}
          <>
            <Tooltip content="Change layout">
              <Button
                onClick={() => workspace.setIsApply("layout")}
                size="icon"
                className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
              >
                <Layout size={32} />
              </Button>
            </Tooltip>

            {isSample && (
              <Tooltip content="Change layout section style">
                <Button
                  onClick={() => workspace.setIsApply("layout-section-style")}
                  size="icon"
                  className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
                >
                  <PaintBrushBroad size={32} />
                </Button>
              </Tooltip>
            )}
          </>
          <Tooltip content="Change workspace">
            <Button
              onClick={() => workspace.setOrder(workspace.order === 0 ? 1 : 0)}
              size="icon"
              className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
            >
              <Swap size={32} />
            </Button>
          </Tooltip>
          <Tooltip content="Export">
            <DropdownMenuExport
              onExportToPDF={onExportToPDF}
              onExportToDOCX={onExportToDOCX}
              onExportToTXT={onExportToTXT}
              isDownloading={isDoing}
            >
              <Button
                size="icon"
                className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
              >
                <Download size={32} />
              </Button>
            </DropdownMenuExport>
          </Tooltip>
          {!isDesktop && (
            <>
              <Button
                onClick={() => setOpenPreview(!openPreview)}
                size="icon"
                className="p-2 bg-slate-600 hover:bg-gradient-to-t hover:from-backgroundColor-second hover:to-secondary-main"
              >
                <ImEnlarge size={20} />
              </Button>
              {openPreview && (
                <PreviewModal onClose={() => setOpenPreview(false)} />
              )}
            </>
          )}
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={false}
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleUploadToPage(e.target.files![0])}
      />
    </>
  );
};
