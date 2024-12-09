"use client";
import SettingItem from "@/modules/Admin/NotificationSetting/SettingItem";
import { Box, Paper, Typography } from "@mui/material";

const data = [
  {
    title: "Template",
    items: ["Lorem1", "Lorem2", "Lorem3"],
  },
  {
    title: "Blogs",
    items: ["Lorem1", "Lorem2", "Lorem3"],
  },
  {
    title: "Users",
    items: ["Lorem1", "Lorem2", "Lorem3"],
  },
  {
    title: "Comments",
    items: ["Lorem1", "Lorem2", "Lorem3"],
  },
];

const NotificationSetting = () => {
  return (
    <Box width={"100%"} mt={"60px"} mx={"80px"}>
      <Typography
        sx={{
          mb: "32px",
          fontSize: "36px",
          lineHeight: "40px",
          fontWeight: 700,
        }}
      >
        Notification Settings
      </Typography>
      <Paper sx={{ width: "100%" }}>
        {data.map((item, idx) => {
          return <SettingItem key={idx} data={item} />;
        })}
      </Paper>
    </Box>
  );
};

export default NotificationSetting;
