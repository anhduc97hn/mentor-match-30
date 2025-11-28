"use client"; // This directive makes it a client component

import { Button, Stack, SxProps, Theme } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
// Assuming updateSessionStatus is an async thunk that returns a promise
import { updateSessionStatus } from "@/src/slices/sessionSlice"; 
import { useRouter } from "next/navigation";
import { Session } from "@/src/types/session";
import { useAppDispatch } from "@/src/appService/hooks";

// Define the component's props with explicit typing
interface ActionButtonProps {
  currentUserProfileId: string;
  session: Session;
  sx?: SxProps<Theme>; // Optional Material UI system props
  prevStatus?: string;
}

function ActionButton({ currentUserProfileId, session, sx, prevStatus }: ActionButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, to } = session;
  const sessionId = session._id;

  const btnCancelRequest = (
    <Button
      // Type casting `sx` to handle the spread operator with string/object mix
      sx={{ fontSize: "0.6rem", ...(sx as object) }} 
      size="small"
      variant="contained"
      color="error"
      onClick={async () => {
        await dispatch(
          updateSessionStatus({ sessionId, status: "cancelled", prevStatus })
        );
        router.push("/account/session");
      }}
    >
      Cancel Request
    </Button>
  );

  const btnGroupReact = (
    <Stack direction="row" spacing={1}>
      <Button
        sx={{ fontSize: "0.6rem", ...(sx as object) }}
        size="small"
        variant="contained"
        color="success"
        onClick={async () => {
          await dispatch(
            updateSessionStatus({ sessionId, status: "accepted", prevStatus })
          );
          router.push("/account/session");
        }}
      >
        Accept
      </Button>
      <Button
        sx={{ fontSize: "0.6rem", ...(sx as object) }}
        size="small"
        variant="outlined"
        color="error"
        onClick={async () => {
          await dispatch(
            updateSessionStatus({ sessionId, status: "declined", prevStatus })
          );
          router.push("/account/session");
        }}
      >
        Decline
      </Button>
    </Stack>
  );

  if (status === "pending" && to._id === currentUserProfileId)
    return btnGroupReact;
  else if (
    status !== "completed" &&
    status !== "reviewed" &&
    status !== "cancelled"
  )
    return btnCancelRequest;
}

export default ActionButton;