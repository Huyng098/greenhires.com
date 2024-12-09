"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  imgs: string[];
}

export default function PreviewDialog({ imgs }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="relative hover:cursor-pointer"
        style={{ height: "118.8px", width: "84px" }}
      >
        <Image
          src={
            imgs[0] === "string" ? "/images/admin/resume_example.svg" : imgs[0]
          }
          alt="image"
          className="transition-all duration-500 ease-in-out relative z-0"
          fill
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out z-10 bg-black bg-opacity-50">
          <Eye size={24} color="#ffffff" />
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="z-[100]"/>
          <DialogContent
            className="h-full flex flex-col gap-4 p-0 overflow-y-auto max-h-screen bg-white z-[100]"
            style={{ overflowY: "auto", maxWidth: `${210 * 3}px` }}
          >
            {/* {imgs.map((img, idx) => (
                <div
                key={idx}
                style={{ height:  `${297*3}px`, width:  `${210*3}px` }}
                className="relative"
                >
                <Image
                    src={
                    img === "string" ? "/images/admin/resume_example.svg" : img
                    }
                    alt="image"
                    className="transition-all duration-500 ease-in-out relative z-0"
                    fill
                />
                </div>
            ))} */}
            <div style={{ minHeight: `${297 * 3}px` }} className="relative">
              <Image
                src={"/images/admin/resume_example.svg"
                }
                alt="image"
                className="transition-all duration-500 ease-in-out relative z-0"
                fill
              />
            </div>
            <div style={{ minHeight: `${297 * 3}px` }} className="relative">
              <Image
                src={
                  imgs[0] === "string"
                    ? "/images/background_resume/background_resume_1.jpg"
                    : imgs[0]
                }
                alt="image"
                className="transition-all duration-500 ease-in-out relative z-0"
                fill
              />
            </div>
            <div style={{ minHeight: `${297 * 3}px` }} className="relative">
              <Image
                src={
                  imgs[0] === "string"
                    ? "/images/background_resume/background_resume_1.jpg"
                    : imgs[0]
                }
                alt="image"
                className="transition-all duration-500 ease-in-out relative z-0"
                fill
              />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
