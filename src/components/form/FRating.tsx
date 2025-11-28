"use client"

import { useFormContext, Controller } from "react-hook-form";
import { Rating, FormHelperText } from "@mui/material";

interface FRatingProps {
  name: string;
  [key: string]: any;
}

function FRating({ name, ...other }: FRatingProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Rating {...field} {...other} />
          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

export default FRating;