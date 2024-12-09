"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SAMPLE_TYPES } from "@/constants/dashboard";
import {
  Copy,
  FileDoc,
  FilePdf,
  FileX,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const DeleteDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);
interface DropdownMenuCRUDResumeProps {
  status?: string;
  onEdit?: () => void;
  onDuplicate?: (open: boolean) => void;
  onExportToPDF: () => void;
  onExportToDOCX?: () => void;
  onExportToTXT?: () => void;
  isDownloading: boolean;
  onDelete: () => void;
  type?: SAMPLE_TYPES | "resume";
  children?: React.ReactNode;
}

export function DropdownMenuCRUDResume({
  status,
  onEdit,
  onDuplicate,
  onExportToPDF,
  onExportToDOCX,
  onExportToTXT,
  onDelete,
  isDownloading,
  type = "resume",
  children,
}: DropdownMenuCRUDResumeProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <PencilSimple size={20} color="dark" weight="light" />
              <p className="ml-2">Edit</p>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem disabled={isDownloading} onClick={onExportToPDF}>
            <FilePdf size={20} color="dark" weight="light" />
            <p className="ml-2">Download PDF</p>
          </DropdownMenuItem>
          {onDuplicate && (
            <DropdownMenuItem onClick={() => onDuplicate(true)}>
              <Copy size={20} color="dark" weight="light" />
              <p className="ml-2">Duplicate</p>
            </DropdownMenuItem>
          )}
          {onExportToDOCX && (
            <DropdownMenuItem disabled={isDownloading} onClick={onExportToDOCX}>
              <FileDoc size={20} color="dark" weight="light" />
              <p className="ml-2">Export to DOCX</p>
            </DropdownMenuItem>
          )}
          {onExportToTXT && (
            <DropdownMenuItem disabled={isDownloading} onClick={onExportToTXT}>
              <FileX size={20} color="dark" weight="light" />
              <p className="ml-2">Export to TXT</p>
            </DropdownMenuItem>
          )}

          {(status === "pending" ||
            status === "rejected" ||
            type === "resume") && (
            <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
              <Trash size={20} color="red" weight="light" />
              <p className="ml-2 text-red-500">Delete</p>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {openDeleteDialog && (
        <DeleteDialog
          title={`Are you sure you want to delete this ${type}?`}
          description="This action cannot be undone, and it will be permanently deleted."
          cancelText="Cancel"
          confirmText="Delete"
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          handleConfirm={onDelete}
        />
      )}
    </>
  );
}
