import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Status } from "@/interfaces/base";
import { useDeleteSample } from "@/services/sample/query";
import { DotsThree, Pencil, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  id: string;
  role?: string;
  typeButton?: string;
  status?: Status;
}
export default function ActionButton({ id, role, typeButton, status }: Props) {
  const { deleteSampleById, isPending, error } = useDeleteSample();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsThree size={32} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={status === "waiting" || status === "approved"}
          >
            {typeButton === "edit" && (
              <Link
                href={`/consultant/canva/${id}/edit-sample`}
                className="flex gap-3"
              >
                <Pencil size={24} /> Edit
              </Link>
            )}
          </DropdownMenuItem>
          {typeButton !== "edit" && (
            <DropdownMenuItem>
              <Link href={`/admin/samples/${id}/review`} className="flex gap-3">
                <Pencil size={24} /> Review
              </Link>
            </DropdownMenuItem>
          )}
          {typeButton === "review" ? (
            <DropdownMenuItem
              disabled={role !== "superadmin"}
              className="flex gap-3"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <Trash size={24} />
              Delete
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={
                role !== "superadmin" &&
                (status === "waiting" || status === "approved")
              }
              className="flex gap-3"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <Trash size={24} />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center my-5">
              Do you want to delete this template?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(!open)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(!open);
                deleteSampleById(id);
              }}
              className="bg-hoduc-bg-error hover:bg-hoduc-bg-error/85"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
