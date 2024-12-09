"use client";

import { LanguageTranslation } from "@/modules/Builder/SidebarRight/language-translation";
import { useUploadImage } from "@/services/resume/query";
import { useResumeStore } from "@/stores/resume";
import { Translate } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import { useState } from "react";
import { Loading } from "../Common/Loading";
import CustomStyle from "../CustomStyle";

const UploadModal = dynamic(
  () => import("./Modal").then((module) => module.UploadModal),
  { ssr: false }
);

const Profile = () => {
  const { isPending, uploadResumeImage } = useUploadImage();
  const avatar = useResumeStore()(
    (state) => state.resume.resume_data?.basics?.picture
  );
  const setValue = useResumeStore()((state) => state.setResume);
  const resume_id = useResumeStore()((state) => state.resume.id);
  const [modalOpen, setModalOpen] = useState(false);

  const updateAvatar = async (imgSrc: string) => {
    uploadResumeImage({ imgSrc, resume_id });
  };

  return (
    <>
      <div className="flex w-full gap-4 items-center">
        <div className="relative">
          {isPending ? (
            <div className="bg-gray-200 flex items-center justify-center rounded-full w-[80px] h-[80px]">
              <Loading color="#C8C8C8" size="1.5rem" />
            </div>
          ) : (
            <NextImage
              src={avatar || "/images/editimage/user.png"}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <button
            disabled={isPending}
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
        <div className="flex gap-2 items-center">
          <button
            disabled={isPending}
            className="text-primary-main font-bold hover:opacity-80"
            onClick={() => setModalOpen(true)}
          >
            Upload Photo
          </button>
          <CustomStyle identifier="avatar" setValue={setValue} />
        </div>
        <LanguageTranslation>
          <button className="text-white p-2 ml-auto rounded items-center flex gap-2 bg-gradient-to-t to-[#06B2B9] from-[#2F566B] hover:opacity-90">
            <Translate size={25} />
            Languages
          </button>
        </LanguageTranslation>
      </div>
      {modalOpen && (
        <UploadModal
          updateAvatar={updateAvatar}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  );
};

export default Profile;
