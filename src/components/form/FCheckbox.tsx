"use client"

import { useFormContext, Controller } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";

interface FCheckboxProps {
  name: string;
  [key: string]: any;
}

function FCheckbox({ name, ...other }: FCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      label={null}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} size="small" />}
        />
      }
      {...other}
    />
  );
}

export default FCheckbox;