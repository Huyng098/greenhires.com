"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopySimple, Eye, EyeSlash, Trash } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const DeleteDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

export const DropdownItemCRUD = ({
  children,
  visible = true,
  onDuplicate,
  onDelete,
  onToggleVisibility,
}: Props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <>
      {openDeleteDialog && (
        <DeleteDialog
          title={`Are you sure you want to delete this item?`}
          description="This action cannot be undone."
          cancelText="Cancel"
          confirmText="Delete"
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          handleConfirm={onDelete}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="right">
          <DropdownMenuItem onClick={onToggleVisibility} className="space-x-2">
            {!visible ? (
              <EyeSlash size={20} weight="thin" />
            ) : (
              <Eye size={20} weight="thin" />
            )}
            <p>Visible</p>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate} className="space-x-2">
            <CopySimple size={20} weight="thin" />
            <p>Duplicate</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="space-x-2 text-red-400"
          >
            <Trash size={20} weight="light" />
            <p>Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
