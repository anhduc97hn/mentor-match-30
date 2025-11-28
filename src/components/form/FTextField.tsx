"use client"

import { useFormContext, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

interface FTextFieldProps {
  name: string;
  [key: string]: any;
}

function FTextField({ name, ...other }: FTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}

export default FTextField;