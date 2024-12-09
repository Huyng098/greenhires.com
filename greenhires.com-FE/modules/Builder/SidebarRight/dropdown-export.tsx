"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDoc, FilePdf, FileX } from "@phosphor-icons/react";
import { forwardRef } from "react";

interface DropdownExportProps {
  onExportToPDF: () => void;
  onExportToDOCX?: () => void;
  onExportToTXT?: () => void;
  isDownloading: boolean;
  children?: React.ReactNode;
}

export const DropdownMenuExport = forwardRef<
  HTMLDivElement,
  DropdownExportProps
>(
  (
    { isDownloading, onExportToPDF, onExportToDOCX, onExportToTXT, children },
    ref
  ) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent ref={ref} className="w-48">
          <DropdownMenuItem disabled={isDownloading} onClick={onExportToPDF}>
            <FilePdf size={20} color="dark" weight="light" />
            <p className="ml-2">Download PDF</p>
          </DropdownMenuItem>

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
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
