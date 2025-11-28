"use client"

import { useFormContext, Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

interface FDateTimePickerProps {
  name: string;
  label?: string;
  [key: string]: any; // for ...other props
}

function FDateTimePicker({ name, label, ...other }: FDateTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <DateTimePicker {...field} label={label} {...other} />
          {error && (
            <TextField value={error.message} error helperText={error.message} />
          )}
        </>
      )}
    />
  );
}

export default FDateTimePicker;