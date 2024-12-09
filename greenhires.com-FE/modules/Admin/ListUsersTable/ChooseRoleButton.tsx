import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { userChangeRoleUser } from "@/services/user";

interface ChooseRoleButtonProps {
  id: string;
  role: string;
}

export default function ChooseRoleButton({ id, role }: ChooseRoleButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [roleSelected, setRoleSelected] = useState<string>("");
  const { changeRoleUserById, isPending, error } = userChangeRoleUser();

  return (
    <>
      <Select
        defaultValue={role}
        onValueChange={(value) => {
          setRoleSelected(value);
          setOpen(!open);
        }}
      >
        <SelectTrigger className="w-[180px] focus-visible:ring-0 focus-visible:ring-offset-0 ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="superadmin">SuperAdmin</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="consultant">Consultant</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="enduser">End user</SelectItem>
          <SelectItem value="client">Client</SelectItem>
        </SelectContent>
      </Select>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center my-5">
              {`Do you want to change role of this user to ${roleSelected}`}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(!open)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(!open);
                changeRoleUserById({ id, role: roleSelected });
              }}
              className="bg-hoduc-bg-error hover:bg-hoduc-bg-error/85"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
