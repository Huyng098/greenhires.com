import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "@phosphor-icons/react";
import { useState } from "react";

interface Props {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  old_title: string;
  handleSubmit: (title: string) => void;
}

export function DuplicateDialogTitle({
  title,
  open,
  setOpen,
  old_title,
  handleSubmit,
}: Props) {
  const [value, setValue] = useState(`${old_title} (Copy)`);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex text-primary-main items-center space-x-2.5">
              <Plus />
              <h2>Duplicate a copy of {title}</h2>
            </div>
          </DialogTitle>
          <DialogDescription className="ml-3">
            Start duplicating your {title} by giving it a name.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(value);
          }}
        >
          <div className="py-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              onChange={(e) => setValue(e.target.value)}
              required
              value={value}
              id="title"
              placeholder={`Enter your ${title} title`}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" className="bg-primary-main">
                Duplicate
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
