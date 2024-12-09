"use client";
import { useDeleteme, useSignOut } from "@/services/user";
import { Box, Menu, MenuItem, Paper } from "@mui/material";
import {
  CreditCard,
  ShieldStar,
  ShoppingCart,
  SignOut,
  TrashSimple,
  User,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";
import { MouseEvent, useState } from "react";
import { IoIosMore } from "react-icons/io";
const DeleteDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);
const DashboardSidebarMobile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { logout } = useSignOut();

  const handleLogOut = () => {
    try {
      logout();
    } catch (err) {
      console.log(err);
    }
  };
  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const { isPending: isDeletePending, deleteMe } = useDeleteme();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "60px",
          bgcolor: "black",
          position: "fixed",
          bottom: 0,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            bgcolor: "white",
            position: "fixed",
            bottom: 0,
            p: "10px",
            display: "flex",
            zIndex: "1000",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            width={"33.33%"}
            onClick={() => {
              NProgress.start();
              router.push("/dashboard/my-account");
            }}
          >
            <User size={20} /> Profile
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            width={"33.33%"}
            onClick={() => {
              router.push("/dashboard/change-password");
              NProgress.start();
            }}
          >
            <ShieldStar size={20} />
            Password
          </Box>
          <Box
            component={"button"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            width={"33.33%"}
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleOpenMenu}
          >
            <IoIosMore size={20} />
            More
          </Box>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            disableScrollLock
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={open}
            onClose={handleCloseMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                router.push("/dashboard/my-package");
                NProgress.start();
              }}
              sx={{ gap: 1 }}
            >
              <CreditCard size={20} />
              Pricing Plans
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/dashboard/billing");
                NProgress.start();
              }}
              sx={{ gap: 1 }}
            >
              <ShoppingCart size={20} />
              Billing
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenDelete(true);
              }}
              sx={{ gap: 1 }}
            >
              <TrashSimple size={20} />
              Delete account
            </MenuItem>
            <MenuItem onClick={handleLogOut} sx={{ gap: 1 }}>
              <SignOut size={20} />
              Sign out
            </MenuItem>
          </Menu>
        </Paper>
      </Box>
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

export default DashboardSidebarMobile;
