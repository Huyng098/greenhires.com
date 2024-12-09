"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type DialogConfirmType = {
  handleDelete: () => void;
  open: boolean;
  handleClose: () => void;
  handleOk?: () => void;
  title?: string;
  content?: string;
  textCancel: string;
  textOk: string;
};

const DialogConfirm = ({
  handleDelete,
  open,
  handleClose,
  handleOk,
  title,
  content,
  textCancel,
  textOk,
}: DialogConfirmType) => {
  return (
    <Dialog
      disableScrollLock
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            bgcolor: "white",
            color: "black",
            textTransform: "none",
            border: "1px solid #ccc",
            "&:hover": { bgcolor: "white", color: "black" },
          }}
          size="small"
          onClick={handleClose}
        >
          {textCancel}
        </Button>
        <Button
          sx={{
            bgcolor: "#D33D3D",
            color: "white",
            textTransform: "none",
            "&:hover": { bgcolor: "#D33D3D", color: "white" },
          }}
          onClick={() => {
            handleClose();
            handleDelete();
          }}
          size="small"
        >
          {textOk}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirm;
