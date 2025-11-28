"use client"

import { useFormContext, Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

interface FAutoCompleteProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
  label: string;
  [key: string]: any;
}

function FAutoComplete({ name, options, label, ...other }: FAutoCompleteProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { ref, ...fieldProps } = field;

        return (
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            sx={{ width: 300 }}
            {...fieldProps}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                inputRef={ref}
              />
            )}
            onChange={(_, newValue) => {
              field.onChange(newValue);
            }}
            {...other}
          />
        );
      }}
    />
  );
}

export default FAutoComplete;