"use client";

import NextImage from "next/image";
import { useState } from "react";

import { UploadModal } from "./UploadModal";
import { Button } from "@/components/ui/button";
import { TrashSimple } from "@phosphor-icons/react";

const Profile = () => {
  //   const { isPending, uploadResumeImage } = useUploadImage();

  const [modalOpen, setModalOpen] = useState(false);

  //   const updateAvatar = async (imgSrc: string) => {
  //     uploadResumeImage({ imgSrc, resume_id });
  //   };

  return (
    <>
      <div className="flex gap-16 items-center">
        <div className="relative">
          <NextImage
            src={"/images/editimage/user.png"}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full"
          />
          <button
            className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-white hover:bg-gray-100 border border-gray-600"
            title="Change photo"
            onClick={() => setModalOpen(true)}
          >
            <NextImage
              priority
              src="/icons/pencil.svg"
              height={16}
              width={16}
              alt="Pencil"
            />
          </button>
        </div>
        <div className="flex gap-4">
          <Button className="bg-primary-main hover:bg-primary-main/85">
            Update
          </Button>
          <Button variant={"outline"}>
            <TrashSimple size={20} />
            Remove
          </Button>
        </div>
      </div>
      {modalOpen && (
        <UploadModal
          // updateAvatar={updateAvatar}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  );
};

export default Profile;
