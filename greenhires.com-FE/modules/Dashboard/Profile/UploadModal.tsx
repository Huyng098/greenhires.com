import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  
  import ImageCropper from "./ImageCropper";
  
  interface UploadModal {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export const UploadModal = ({
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
          <ImageCropper  onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  };
  