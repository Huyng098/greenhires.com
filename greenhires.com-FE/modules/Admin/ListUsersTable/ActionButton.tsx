import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/services/user";

interface Props {
  id: string
}

export default function ActionButton({id} : Props) {
  const [open, setOpen] = useState<boolean>(false);

  const { deleteUserbyId, isPending, error } = useDeleteUser()

  return (
    <>
      <Button
        variant={"ghost"}
        size="icon"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Trash size={32} className="h-4 w-4" />
      </Button>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center my-5">
              Do you want to delete this user?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(!open)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(!open);
                deleteUserbyId(id)
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
