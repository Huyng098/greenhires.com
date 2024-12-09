"use client";
import { useI18n } from "@/config/i18n/client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UserSquare } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import {
  Cropper,
  CropperPreview,
  CropperPreviewRef,
  CropperRef,
} from "react-advanced-cropper";
import { useDropzone } from "react-dropzone";

export const UploadAvatar = () => {
  const previewRef = useRef<CropperPreviewRef>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [src, setSrc] = useState(
    "https://images.unsplash.com/photo-1623432532623-f8f1347d954c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"
  );

  const onUpdate = () => {
    previewRef.current?.refresh();
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });
  const [open, setOpen] = useState(false);
  const t = useI18n();
  return (
    <>
      <div className="mx-10 flex items-center">
        <div className="bg-slate-200 p-2 rounded">
          <UserSquare size={40} color="#ffffff" weight="thin" />
        </div>
        <div className="ml-2">
          <p> {t("builder.avatar")} </p>
        </div>
      </div>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={open}
      >
        <DialogTitle>Phone Ringtone</DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    </>
  );
};

export default UploadAvatar;
