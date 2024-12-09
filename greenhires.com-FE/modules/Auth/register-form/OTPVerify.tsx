"use client";
import { VerifyEmailForm } from "@/interfaces/user";
import { TextField, Box } from "@mui/material";
import React, { useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import OtpInput from "react-otp-input";

interface OTPVerifyProps {
  control: Control<VerifyEmailForm>;
  name: keyof VerifyEmailForm;
}

const OTPVerify = ({ control, name }: OTPVerifyProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange }, formState: { errors } }) => (
          <OtpInput
            value={value}
            onChange={onChange}
            numInputs={6}
            inputStyle="font-[500] text-lg px-5"
            renderSeparator={<div className="px-3" />}
            renderInput={(props) => <TextField inputProps={{ ...props }} error={!!errors?.[name]?.type} />}
          />
        )}
      />
    </Box>
  );
};

export default OTPVerify;
