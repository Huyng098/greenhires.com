import { Loading } from "@/components/Common/Loading";
import { Button } from "@/components/ui/button";
import { useDeleteImage } from "@/services/user";
import { Close } from "@mui/icons-material";
import NextImage from "next/image";
import { useState } from "react";

type Props = {
  url: string;
  onClick: (url: string) => void;
};

const UploadedPhoto = (props: Props) => {
  const [isShow, setIsShow] = useState(false);
  const { deleteImage, isPending, error } = useDeleteImage();
  return (
    <div
      style={{ cursor: "pointer", position: "relative" }}
      onClick={() => props.onClick(props.url)}
      onMouseOut={() => setIsShow(false)}
      onMouseOver={() => setIsShow(true)}
    >
      <div
        style={{
          position: "absolute",
          opacity: isShow ? 1 : 0,
          zIndex: 1,
          top: 0,
          right: 0,
        }}
        className="transition-all duration-300 ease-in-out"
      >
        <Button
          className="h-8 w-8 rounded-md bg-black/55"
          onClick={(e) => {
            e.stopPropagation();
            deleteImage(props.url);
          }}
        >
          <Close fontSize="inherit" />
        </Button>
      </div>
      <div style={{ paddingBottom: "100%", height: 0 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NextImage
          style={{ maxHeight: "100%" }}
          loading="lazy"
          src={props.url}
          alt="upload"
          fill
          objectFit="contain"
        />
      </div>
      {isPending && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.5)",
            zIndex: 2,
          }}
        >
          <Loading color="white" />
        </div>
      )}
    </div>
  );
};

export default UploadedPhoto;
