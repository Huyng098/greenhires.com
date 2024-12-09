import { Button } from "@/components/ui/button";
import { useEditor } from "@/lib/design-editor";
import { fetchSvgContent } from "@/lib/design-utils";
import { useGetCanvaImages, useUploadCanva } from "@/services/user";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import NextImage from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import UploadedPhoto from "./UploadedPhoto";

const UploadContent = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { actions } = useEditor();
  const limit = 50;
  const { isUploading, uploadImageRQ } = useUploadCanva();
  const [offset, setOffset] = useState(0);
  const { images } = useGetCanvaImages(limit, offset);
  const addImage = async (url: string) => {
    const img = new Image();
    img.onerror = (err) => window.alert(err);
    img.src = url;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      actions.addImageLayer(
        { url, thumb: url },
        { width: img.naturalWidth, height: img.naturalHeight }
      );
    };
  };
  const addSvg = async (url: string) => {
    const ele = await fetchSvgContent(url);
    const viewBox = ele.getAttribute("viewBox")?.split(" ") || [];
    const width =
      viewBox.length === 4 ? +viewBox[2] : +(ele.getAttribute("width") || 100);
    const height =
      viewBox.length === 4 ? +viewBox[3] : +(ele.getAttribute("height") || 100);

    actions.addSvgLayer(url, { width, height }, ele);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file?.size && file.size > 1024 * 1024 * 10) {
      toast.error("File size should be less than 10MB");
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", "canva");
      await uploadImageRQ(formData);
    }
  };
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          overflowY: "auto",
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            height: 48,
            borderBottom: "1px solid rgba(57,76,96,.15)",
            padding: "0 20px",
          }}
        >
          <p
            style={{
              lineHeight: "48px",
              fontWeight: 600,
              flexGrow: 1,
            }}
            className="text-white"
          >
            Upload Images
          </p>
        </div>
        {!isUploading ? (
          <button
            style={{
              margin: 16,
              background: "#3a3a4c",
              borderRadius: 8,
              color: "#fff",
              padding: "8px 16px",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => inputFileRef.current?.click()}
          >
            Upload
          </button>
        ) : (
          <p className="text-white text-center">Uploading...</p>
        )}
        <input
          ref={inputFileRef}
          accept="image/*"
          style={{ display: "none" }}
          type={"file"}
          onChange={handleUpload}
        />
        <div style={{ padding: "16px" }}>
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gridGap: 8,
            }}
          >
            {images?.items.map((item, idx) => (
              <UploadedPhoto
                key={idx}
                url={item.url}
                onClick={item.type === "image" ? addImage : addSvg}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-5 w-full px-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOffset((old) => Math.max(old - limit, 0))}
          disabled={offset === 0}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOffset((old) => old + limit)}
          disabled={offset + limit >= (images?.total || 0)}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default UploadContent;
