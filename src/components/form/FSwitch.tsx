"use client"

import { useFormContext, Controller } from "react-hook-form";
import { Switch, FormControlLabel } from "@mui/material";

interface FSwitchProps {
  name: string;
  [key: string]: any;
}

function FSwitch({ name, label,...other }: FSwitchProps) {
 const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Switch {...field} checked={field.value} />}
        />
      }
      label={label}
      {...other}
    />
  );
}

export default FSwitch;