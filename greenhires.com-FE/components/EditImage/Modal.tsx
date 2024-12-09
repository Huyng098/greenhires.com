import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import ImageCropper from "./ImageCropper";

interface UploadModal {
  updateAvatar: (imgSrc: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadModal = ({
  updateAvatar,
  open,
  onOpenChange,
}: UploadModal) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a file</DialogTitle>
          <DialogDescription>File upload description</DialogDescription>
        </DialogHeader>
        <ImageCropper updateAvatar={updateAvatar} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};
