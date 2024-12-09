"use client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/services/user";
import { useAuthStore } from "@/stores/auth";
import { AppBar, Box, Typography } from "@mui/material";
import { Gear, SignOut } from "@phosphor-icons/react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { InternalNotification } from "./Notification";
const HeaderConsultantSetting = () => {
  const user = useAuthStore()((state) => state.user);
  const { logout } = useSignOut(true);
  const router = useRouter();
  return (
    <AppBar
      elevation={1}
      sx={{
        width: "100%",
        height: "60px",
        bgcolor: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        px: "50px",
      }}
    >
      {/*<Box
        className="cursor-pointer"
        onClick={() => {
          router.push("/consultant/dashboard");
        }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Image
          src="/images/logo/humantree.svg"
          alt="Humantree"
          className="dark:invert"
          width={79}
          height={37}
          priority
        />
        <Typography
          sx={{
            fontStyle: "italic",
            color: "#06B2B9",
            fontWeight: 800,
            fontSize: "14px",
            marginLeft: "10px",
          }}
        >
          Green Hires
        </Typography>
        </Box>*/}
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={1}
      >
        <InternalNotification />
        {user && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Image
                    src={user.picture || "/images/auth/avatar.svg"}
                    width={30}
                    height={30}
                    alt="avatar"
                    style={{ borderRadius: "50%", height: "30px" }}
                  />
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    {user?.firstname} {user?.lastname}
                  </Typography>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32 z-[9999]">
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/consultant/settings");
                  }}
                >
                  <Gear size={24} weight="light" />
                  <p className="ml-2">Settings</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                  }}
                >
                  <SignOut size={24} />
                  <p className="ml-2">Sign out</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </Box>
    </AppBar>
  );
};

export default HeaderConsultantSetting;
