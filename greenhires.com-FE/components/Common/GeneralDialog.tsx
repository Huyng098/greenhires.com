import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import classNames from "classnames";

interface DialogProps {
  title: string;
  open: boolean;
  description: string;
  cancelText: string;
  confirmText: string;
  setOpen: (open: boolean) => void;
  confirmButtonColor?: string;
  handleConfirm: () => void;
}

export function GeneralDialog({
  title,
  description,
  cancelText,
  confirmText,
  open,
  setOpen,
  confirmButtonColor,
  handleConfirm,
}: DialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-md font-medium">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={classNames(
              "text-white",
              confirmButtonColor || "bg-red-500 hover:bg-red-600"
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
