import {
  CameraRotate,
  CloudArrowUp,
  Image as ImageIcon,
  UploadSimple,
} from "@phosphor-icons/react";
import NextImage from "next/image";
import { DragEvent, useRef, useState } from "react";
import ReactCrop, {
  Crop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Slider } from "@/components/ui/slider";
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 100;

interface Props {
  onOpenChange: (open: boolean) => void;
}

const ImageCropper = ({ onOpenChange }: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [error, setError] = useState("");
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);

  const onDropFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onSelectFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: any) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    onDropFile(event.dataTransfer.files[0]);
  };
  const fileUploadRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Choose profile photo</span>
        <input
          ref={fileUploadRef}
          id="upload-file"
          type="file"
          hidden
          accept="image/*"
          onChange={onSelectFile}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600 hidden"
        />
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {!imgSrc && (
        <div className="flex justify-center items-center">
          <label
            className="border-2 border-dashed border-secondary-main rounded-xl w-full h-full text-center align-middle text-xl flex flex-col items-center justify-center "
            htmlFor="upload-file"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="hover:cursor-pointer flex flex-col gap-4 items-center mx-10 my-2">
              <CloudArrowUp size={60} color="#19B2B9" weight="thin" />
              <span className="text-primary-main">
                Drag your image here, or{" "}
                <span className="text-secondary-main underline font-semibold">
                  browse
                </span>
              </span>

              <span className="text-gray-400 text-sm">
                Support: JPG, SVG, PNG
              </span>
            </div>
          </label>
        </div>
      )}
      {imgSrc && (
        <>
          <ScrollArea className="p-4 max-h-[300px] flex flex-col items-center justify-between">
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
              circularCrop
              keepSelection
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
            >
              <NextImage
                ref={imgRef}
                src={imgSrc}
                alt="Upload"
                style={{
                  maxHeight: "100vh",
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                }}
                width={500}
                height={500}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </ScrollArea>
          <div>
            <div className="w-full flex gap-4 items-center">
              <div className="relative hover:cursor-pointer hover:text-secondary-main">
                <CameraRotate
                  onClick={() => setRotate(rotate + 90)}
                  size={30}
                  weight="thin"
                />
                <p className="text-[8px] absolute top-[-3px] right-[-8px]">
                  {" "}
                  +90°
                </p>
              </div>
              <ImageIcon size={40} color="#9c9696" weight="fill" />
              <Slider
                defaultValue={[1]}
                max={3}
                step={0.1}
                className="hover:cursor-pointer"
                onValueChange={(value) => {
                  setScale(Number(value));
                }}
              />
              <ImageIcon size={60} color="#9c9696" weight="fill" />
            </div>

            <div className="flex justify-between gap-20">
              <Button
                variant="outline"
                onClick={() => fileUploadRef.current?.click()}
              >
                <UploadSimple size={20} color="#1d1b1b" weight="thin" />
                <p className="ml-2">New</p>
              </Button>
              <Button
                className="text-white bg-secondary-main hover:bg-secondary-main/80 rounded"
                onClick={() => {
                  if (!crop) return; // Add this line to check if crop is defined
                  if (!previewCanvasRef.current) return; // Add this line to check if previewCanvasRef.current is defined
                  if (!imgRef.current) return; // Add this line to check if imgRef.current is defined
                  setCanvasPreview(
                    imgRef.current, // HTMLImageElement
                    previewCanvasRef.current, // HTMLCanvasElement
                    convertToPixelCrop(
                      crop,
                      imgRef.current?.width ?? 0, // Add null check and fallback value
                      imgRef.current?.height ?? 0 // Add null check and fallback value
                    ),
                    scale,
                    rotate
                  );
                  const dataUrl = previewCanvasRef.current.toDataURL();
                //   updateAvatar(dataUrl);
                  onOpenChange(false);
                }}
              >
                Save Crop
              </Button>
            </div>
          </div>
        </>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};
export default ImageCropper;
