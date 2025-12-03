import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import { UserProfile } from "@/src/types/user";

export default function MentorInfo({ mentor }: { mentor: UserProfile }) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
      <Avatar sx={{ width: "50px", height: "50px" }} src={(mentor?.avatarUrl as string) || ""} alt={mentor?.name} />
      <Stack>
        <Typography variant="body1">Mentor</Typography>
        <Typography variant="subtitle1">{mentor?.name}</Typography>
      </Stack>
    </Stack>
  );
}
