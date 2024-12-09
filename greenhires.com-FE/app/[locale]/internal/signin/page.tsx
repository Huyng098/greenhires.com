"use client";
import { loginDto, loginSchema } from "@/interfaces/user";
import { useLogin } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const loginConsultant = () => {
  const { login, isPending, error } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<loginDto>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<loginDto> = (data) => {
    try {
      login(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ position: "relative" }}>
      <img
        alt="bg-sign-in"
        src={"/images/consultant/bg-login.png"}
        className="z-1 w-full h-[100vh] bg-contain bg-no-repeat relative"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper
          sx={{
            position: "absolute",
            height: "100vh",
            width: "40%",
            right: 0,
            left: "auto",
            top: 0,
            zIndex: 10,
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            mt={"100px"}
          >
            <Image
              src="/images/logo/humantree.svg"
              alt="Vercel Logo"
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
                fontSize: "20px",
              }}
            >
              GreenHires
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "#DC2626",
              fontWeight: 500,
              fontSize: "14px",
              my: "20px",
            }}
          >
            {errors.root ? "Incorrect email address or password." : ""}
          </Typography>
          <Box
            sx={{
              "& .MuiTextField-root": { my: 1, width: "100%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "80%",
            }}
          >
            <Box width={"100%"}>
              <Typography
                sx={{
                  color: errors.root ? "#DC2626" : "#000",
                  fontWeight: 600,
                  fontSize: "14px",
                  ml: "10px",
                }}
              >
                Email Access
              </Typography>
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <TextField
                    size="small"
                    fullWidth
                    InputProps={{
                      sx: {
                        "& fieldset": {
                          border: errors.root
                            ? "1px solid #DC2626"
                            : "1px solid rgba(0, 0, 0, 0.23)",
                        },
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Box>
            <Box width={"100%"}>
              <Typography
                sx={{
                  color: errors.root ? "#DC2626" : "#000",
                  fontWeight: 600,
                  fontSize: "14px",
                  ml: "10px",
                }}
              >
                Password
              </Typography>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <TextField
                    type="password"
                    size="small"
                    fullWidth
                    InputProps={{
                      sx: {
                        "& fieldset": {
                          border: errors.root
                            ? "1px solid #DC2626"
                            : "1px solid rgba(0, 0, 0, 0.23)",
                        },
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Box>
            <Box
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              mt={"20px"}
            >
              <Checkbox size="small" />
              <Typography
                sx={{
                  color: "#000",
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                Remember me
              </Typography>
            </Box>
            <Button
              type="submit"
              sx={{
                width: "100%",
                bgcolor: "#2F566B",
                color: "white",
                mt: "20px",
                textTransform: "none",
                fontWeight: "500",
                "&:hover": {
                  bgcolor: "#2F566B",
                  color: "white",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </form>
    </Box>
  );
};

export default loginConsultant;
