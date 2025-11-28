"use client"

import { useFormContext, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { ReactNode } from "react";

interface FSelectProps {
  name: string;
  children: ReactNode;
  [key: string]: any;
}

function FSelect({ name, children, ...other }: FSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

export default FSelect;