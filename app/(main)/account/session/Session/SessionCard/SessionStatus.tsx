"use client"; // Marks this as a client component

import React from "react";
import { Chip, SxProps, Theme } from "@mui/material"; // Import SxProps and Theme for typing
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import DoNotDisturbAltRoundedIcon from "@mui/icons-material/DoNotDisturbAltRounded";
import { UserProfile } from "@/src/types/user";

// Define the shape of the component's props
interface SessionStatusProps {
    currentUserProfileId: string;
    status: string;
    from: UserProfile;
    to: UserProfile;
    sx?: SxProps<Theme>; // Optional Material UI system props
}

function SessionStatus({ currentUserProfileId, status, from, to, sx }: SessionStatusProps) {
  
  // Use a type cast to safely spread the optional sx prop
  const chipSx = sx as object;
  
  if (!status) return null;

  if (status === "accepted") {
    return (
      <Chip
        sx={{ ...chipSx }}
        icon={<CheckCircleOutlineRoundedIcon />}
        label="Accepted"
        color="success"
      />
    );
  }

  if (status === "completed") {
    return (
      <Chip
        sx={{ ...chipSx }}
        icon={<CheckCircleOutlineRoundedIcon />}
        label="Completed"
        color="success"
      />
    );
  }

  if (status === "declined") {
    return (
      <Chip
        sx={{ ...chipSx }}
        icon={<DoNotDisturbAltRoundedIcon />}
        label="Declined"
        color="error"
      />
    );
  }

  if (status === "cancelled") {
    return (
      <Chip
        sx={{ ...chipSx }}
        icon={<DoNotDisturbAltRoundedIcon />}
        label="Cancelled"
        color="error"
      />
    );
  }

  if (status === "pending") {
    if (from._id === currentUserProfileId) {
      return (
        <Chip
          sx={{ ...chipSx }}
          icon={<MarkEmailReadRoundedIcon />}
          label="Request sent"
          color="warning"
        />
      );
    } else if (to._id === currentUserProfileId) {
      return (
        <Chip
          sx={{ ...chipSx }}
          icon={<PauseCircleOutlineRoundedIcon />}
          // Corrected the typo from the original code: "repsonse" to "response"
          label="Waiting for response" 
          color="warning"
        />
      );
    }
  }

  if (status === "reviewed") {
    return (
      <Chip
        sx={{ ...chipSx }}
        icon={<CheckCircleOutlineRoundedIcon />}
        label="Reviewed"
        color="success"
      />
    );
  }
  
  return null; // Return null if status is unknown/unhandled
}

export default SessionStatus;