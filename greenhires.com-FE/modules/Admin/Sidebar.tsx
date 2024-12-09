"use client";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
const AdminSidebar = () => {
  const [openDialogSignOut, setOpenDialogSignOut] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickNavigate = (path: string) => {
    router.replace(path);
  };

  const handleOpenDialogSignOut = () => {
    setOpenDialogSignOut(true);
  };

  const handleCloseDialogSignOut = () => {
    setOpenDialogSignOut(false);
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 300,
        bgcolor: "background.paper",
        pt: "20px",
      }}
    >
      <List
        component="nav"
        aria-label="main mailbox folders"
        sx={{ mr: "20px" }}
      >
        <ListItemButton
          selected={pathName === "/consultant"}
          //   onClick={() => {
          //     handleClickNavigate("/consultant");
          //   }}
        >
          <ListItemIcon
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              alt="dashboard icon"
              src={"/images/consultant/dashboard.svg"}
              height={20}
              width={20}
            />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <Typography sx={{ ml: "34px", mt: "10px", fontWeight: "600" }}>
          Pages
        </Typography>
        <ListItemButton
          selected={pathName === "/consultant/profile"}
          //   onClick={() => {
          //     handleClickNavigate("/consultant/profile");
          //   }}
        >
          <ListItemIcon
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              alt="user icon"
              src={"/images/admin/user.svg"}
              height={26}
              width={26}
            />
          </ListItemIcon>
          <ListItemText primary="User" />
        </ListItemButton>
        <ListItemButton
          selected={pathName === "/consultant/profile"}
          //   onClick={() => {
          //     handleClickNavigate("/consultant/profile");
          //   }}
        >
          <ListItemIcon
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              alt="profile icon"
              src={"/images/consultant/profile.svg"}
              height={20}
              width={20}
            />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              alt="blog icon"
              src={"/images/admin/blog.svg"}
              height={26}
              width={26}
              style={{ fill: "white" }}
            />
          </ListItemIcon>
          <ListItemText primary="Blog" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 10 }}>
              <ListItemText primary="Review" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default AdminSidebar;
