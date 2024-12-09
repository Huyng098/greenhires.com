"use client";
import { Preview } from "@/lib/design-editor/";
import PreviewMobile from "@/lib/design-editor/editor/mobile";
import useDevices from "@/lib/hooks/useDevices";
import { FC } from "react";

interface PreviewModalProps {
  onClose: () => void;
}

const PreviewModal: FC<PreviewModalProps> = ({ onClose }) => {
  const { isDesktop } = useDevices();
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2001,
        background: "rgba(13,18,22,.7)",
        overflowY: "scroll",
      }}
    >
      {isDesktop ? (
        <Preview onClose={onClose} />
      ) : (
        <PreviewMobile onClose={onClose} />
      )}
    </div>
  );
};

export default PreviewModal;
