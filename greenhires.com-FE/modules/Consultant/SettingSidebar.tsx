"use client";
import { useSignOut } from "@/services/user";
import {
  Book,
  Browser,
  List,
  Notebook,
  SelectionBackground,
  SignOut,
  User,
} from "@phosphor-icons/react";
import classNames from "classnames";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";

export function ConsultantSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useSignOut(true);
  return (
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
            "flex cursor-pointer justify-end mr-4 mt-2",
            !collapsed ? "text-white" : "text-black"
          )}
        >
          <List size={30} weight="light" />
        </div>
        {!collapsed && (
          <div className="mt-10 px-5 text-white">
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
                      router.push("/consultant/dashboard");
                    }}
                    className={`${pathname === "/consultant/dashboard" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                  >
                    <div className={`flex gap-2  `}>
                      <Browser size={24} className="mr-3" /> Dashboard
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      router.push("/consultant/samples");
                    }}
                    className={`${pathname === "/consultant/samples" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                  >
                    <div className="flex gap-2">
                      <Notebook size={24} className="mr-3" />
                      Samples
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      router.push("/consultant/blogs");
                    }}
                    className={`${pathname === "/consultant/blogs" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                  >
                    <div className="flex gap-2">
                      <Book size={24} className="mr-3" />
                      Blogs
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => router.push("/consultant/settings")}
                    className={`${pathname === "/consultant/settings" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                  >
                    <div className="flex gap-2">
                      <User size={24} className="mr-3" />
                      Profile
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => router.push("/consultant/upload-background")}
                    className={`${pathname === "/consultant/upload-background" ? "text-secondary-main bg-[#F4F5F5] rounded-e-lg border-l-4 border-secondary-main border-solid" : ""} `}
                  >
                    <div className="flex gap-2">
                      <SelectionBackground size={24} className="mr-3" />
                      Background
                    </div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logout();
                    }}
                    className={`hover:text-secondary-main`}
                  >
                    <div className="flex gap-2">
                      <SignOut size={24} className="mr-3" />
                      Sign out
                    </div>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}
