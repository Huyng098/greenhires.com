"use client";
import { Loading } from "@/components/Common/Loading";
import { UserDto } from "@/interfaces/user";
import { useDeleteme, useSignOut, useUploadAvatar } from "@/services/user";
import { useAuthStore } from "@/stores/auth";
import {
  List,
  ShieldStar,
  ShoppingCart,
  SignOut,
  UploadSimple,
  User,
} from "@phosphor-icons/react";
import classNames from "classnames";
import dynamic from "next/dynamic";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { ChangeEvent, useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";

const DeleteDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const user = useAuthStore()((state) => state.user);
  const { logout } = useSignOut();

  const handleLogOut = () => {
    try {
      logout();
    } catch (err) {
      console.log(err);
    }
  };
  const { isPending, uploadAvatar } = useUploadAvatar(user as UserDto);
  const { isPending: isDeletePending, deleteMe } = useDeleteme();
  const handleOnChangeAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      formData.append("type", "avatar");
      uploadAvatar(formData);
    }
  };
  return (
    <>
      <div>
        <Sidebar
          collapsed={collapsed}
          collapsedWidth="60px"
          transitionDuration={500}
          breakPoint="md"
          backgroundColor={`${!collapsed ? "#2F566B" : "white"}`}
          width="300px"
          style={{
            borderRight: "0",
            height: "100%",
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            className={classNames(
              "flex cursor-pointer justify-end mr-4",
              !collapsed ? "text-white" : "text-black"
            )}
          >
            <List size={30} weight="light" />
          </div>
          {!collapsed && (
            <div className="mt-10 px-5 text-white">
              <div className="flex justify-between items-center mx-3 my-10 overflow-hidden">
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  onChange={(e) => handleOnChangeAvatar(e)}
                />
                {isPending ? (
                  <>
                    <div className="bg-gray-200 flex items-center justify-center rounded-full w-[80px] h-[80px]">
                      <Loading color="#C8C8C8" size="1.5rem" />
                    </div>
                  </>
                ) : (
                  <>
                    {user?.picture ? (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden">
                        <Image src={user?.picture} alt="Avatar" fill />
                      </div>
                    ) : (
                      <>
                        <label
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          htmlFor="avatar"
                          className="hover:cursor-pointer h-16 w-16 rounded-full bg-gray-300 flex justify-center items-center"
                        >
                          {isHovered && <UploadSimple size={22} />}
                        </label>
                      </>
                    )}
                  </>
                )}
                <p> Welcome {user?.firstname}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 1, marginBottom: "32px" }}>
                  <Menu
                    menuItemStyles={{
                      button: {
                        "&:hover": {
                          backgroundColor: "#2F566B",
                          color: "#06B2B9",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        NProgress.start();
                        router.push("/dashboard/my-account");
                      }}
                      className={`${pathname === "/dashboard/my-account" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                    >
                      <div className={`flex gap-2  `}>
                        <User size={20} /> Public profile
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push("/dashboard/change-password");
                        NProgress.start();
                      }}
                      className={`${pathname === "/dashboard/change-password" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                    >
                      <div className="flex gap-2">
                        <ShieldStar size={20} />
                        Password
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push("/dashboard/billing");
                        NProgress.start();
                      }}
                      className={`${pathname === "/dashboard/billing" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                    >
                      <div className="flex gap-2">
                        <ShoppingCart size={20} />
                        Billing
                      </div>
                    </MenuItem>
                    <MenuItem onClick={() => handleLogOut()}>
                      <div className="flex gap-2">
                        <SignOut size={20} />
                        <p>Sign out</p>
                      </div>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          )}
        </Sidebar>
      </div>
      <DeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action is irreversible."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="bg-red-500"
        handleConfirm={() => deleteMe()}
      />
    </>
  );
};
