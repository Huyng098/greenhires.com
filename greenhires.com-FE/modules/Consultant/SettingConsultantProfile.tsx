"use client";
import { Box, Paper, Typography } from "@mui/material";
import { Button as ButtonAnt, Image } from "antd";
import ImageNextJS from "next/image";

import { Loading } from "@/components/Common/Loading";
import ChangePasswordForm from "@/modules/Dashboard/Password/ChangePasswordForm";
import { useUploadPicture } from "@/services/user";
import { useAuthStore } from "@/stores/auth";
import { UploadSimple } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import ChangeInforForm from "./Profile/ChangeInforForm";

const SettingConsultantProfile = () => {
  const current_user = useAuthStore()((state) => state.user);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<"avatar" | "cover_picture">(
    "avatar"
  );
  const { isPending, uploadPicture } = useUploadPicture(uploadType);
  const handleOnChangePicture = async (
    file: File,
    type: "avatar" | "cover_picture"
  ) => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      uploadPicture(formData);
    }
  };
  if (!current_user)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loading color="#2F566B" />;
      </div>
    );
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1920px",
        m: "60px auto auto",
        px: "60px",
      }}
    >
      <p className="text-xl font-bold mb-5">Profile</p>
      <Paper
        sx={{
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ width: "100%", position: "relative" }}>
          {isPending && uploadType === "cover_picture" ? (
            <Loading color="#C8C8C8" size="1.5rem" />
          ) : (
            <Image
              alt="bg-profile"
              preview={false}
              src={
                current_user.cover_picture
                  ? current_user.cover_picture
                  : "/images/consultant/bg-profile.png"
              }
            />
          )}
          <Box width={"100%"} height={200}></Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "218px",
              right: "14px",
              zIndex: 1000,
            }}
          >
            <input
              type="file"
              id="cover_picture"
              accept="image/*"
              multiple={false}
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                setUploadType("cover_picture");
                handleOnChangePicture(e.target.files![0], "cover_picture");
              }}
            />
            <ButtonAnt
              onClick={() => {
                fileInputRef.current?.click();
              }}
              style={{
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                borderColor: "transparent",
              }}
            >
              <p className="bg-secondary-main text-white p-2 text-base rounded hover:bg-secondary-main/90 ">
                Upload cover
              </p>
            </ButtonAnt>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "86px",
              left: 0,
              right: 0,
              margin: "auto",
              transform: "translateX(-0.6%)",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="flex justify-between items-center mx-3 overflow-hidden">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  multiple={false}
                  className="hidden"
                  onChange={(e) => {
                    setUploadType("avatar");
                    handleOnChangePicture(e.target.files![0], "avatar");
                  }}
                />
                {isPending && uploadType === "avatar" ? (
                  <div className="bg-gray-200 flex items-center justify-center rounded-full w-[96px] h-[96px]">
                    <Loading color="#C8C8C8" size="1.5rem" />
                  </div>
                ) : (
                  <>
                    {current_user?.picture ? (
                      <div className="relative h-24 w-24 rounded-full overflow-hidden">
                        <label
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          htmlFor="avatar"
                          className="hover:cursor-pointer hover:opacity-90 h-24 w-24 rounded-full bg-gray-300 flex justify-center items-center"
                          style={{
                            backgroundImage: `url('${current_user.picture}')`,
                            backgroundSize: "cover",
                          }}
                        >
                          {isHovered && <UploadSimple size={28} />}
                        </label>
                      </div>
                    ) : (
                      <>
                        <label
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          htmlFor="avatar"
                          className="hover:cursor-pointer hover:opacity-90 h-24 w-24 rounded-full bg-gray-300 flex justify-center items-center"
                          style={{
                            backgroundImage:
                              'url("/images/consultant/avatar.png")',
                            backgroundSize: "cover",
                          }}
                        >
                          {isHovered && <UploadSimple size={28} />}
                        </label>
                      </>
                    )}
                  </>
                )}
              </div>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: "15px" }}>
                  {current_user?.firstname + " " + current_user?.lastname}
                </Typography>
                <Box display={"flex"} gap={4} mt={"20px"}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ImageNextJS
                      alt="person-icon"
                      src={"/images/consultant/person_search.svg"}
                      width={20}
                      height={20}
                    />
                    <Typography sx={{ fontSize: "12px" }}>
                      {current_user?.role}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ImageNextJS
                      alt="person-icon"
                      src={"/images/consultant/email.svg"}
                      width={20}
                      height={20}
                    />
                    <Typography sx={{ fontSize: "12px" }}>
                      {current_user?.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ImageNextJS
                      alt="person-icon"
                      src={"/images/consultant/phone.svg"}
                      width={20}
                      height={20}
                    />
                    <Typography sx={{ fontSize: "12px" }}>
                      {current_user?.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ImageNextJS
                      alt="person-icon"
                      src={"/images/consultant/location.svg"}
                      width={20}
                      height={20}
                    />
                    <Typography sx={{ fontSize: "12px" }}>
                      {current_user?.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box height={"100%"}></Box>
      </Paper>
      <Paper
        sx={{
          width: "100%",
          mt: "30px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{ m: "30px", fontSize: "18px", fontWeight: 700, pt: "20px" }}
        >
          Edit your account information:
        </Typography>
        <ChangeInforForm current_user={current_user!} />
      </Paper>

      <Box width={"100%"} mt={"30px"}>
        <ChangePasswordForm bgcolor="white" hasSubmitButton={false} />
      </Box>
    </Box>
  );
};

export default SettingConsultantProfile;
