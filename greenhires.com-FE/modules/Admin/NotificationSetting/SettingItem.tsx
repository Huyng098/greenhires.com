import { Box, Divider, Switch, Typography } from "@mui/material";

type DataType = {
  title: string;
  items: string[];
};
type SettingItemType = {
  data: DataType;
};
const SettingItem = ({ data }: SettingItemType) => {
  return (
    <Box width={"100%"} px={"40px"} pb={0} pt={"20px"}>
      <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
        {data.title}
      </Typography>
      {data.items.map((item) => {
        return (
          <Box
            display={"flex"}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>{item}</Typography>
            <Switch />
          </Box>
        );
      })}
      <Divider sx={{ mt: "10px" }} />
    </Box>
  );
};

export default SettingItem;
