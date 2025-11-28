"use client"; // Marks this as a client component

import React from "react";
import { Alert, Box, Typography, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingScreen from "@/src/components/LoadingScreen";
import SessionCard from "./SessionCard/SessionCard";
import { Session } from "@/src/types/session";
import { UserProfile } from "@/src/types/user";

// Define the shape of the component's props
interface SessionListProps {
    isLoading: boolean;
    error: string | null; // Assuming error is a string or null
    sessions: Session[]; // Array of session objects
    userProfile: UserProfile;
    total?: number;
    totalPages: number;
    // setPage is a function that updates the page number (state setter)
    setPage: React.Dispatch<React.SetStateAction<number>>; 
    prevStatus?: string; // Optional prop
}

function SessionList({
    isLoading,
    error,
    sessions,
    userProfile,
    total,
    totalPages,
    setPage,
    prevStatus,
}: SessionListProps) {
  return (
    <>
      {isLoading ? (
        <LoadingScreen sx={{ top: 0, left: 0 }} />
      ) : (
        <>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              {sessions.length > 0 ? (
                <Stack spacing={2}>
                  {sessions.map((session) => (
                    <SessionCard
                      session={session}
                      key={session._id}
                      currentUserProfileId={userProfile._id}
                      prevStatus={prevStatus}
                    />
                  ))}
                </Stack>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center"}}>
                  <Typography variant="subtitle1">No Session Yet</Typography>
                </Box>
              )}
            </>
          )}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {total ? (
              <LoadingButton
                sx={{ mt: 2 }}
                variant="outlined"
                size="small"
                loading={isLoading}
                onClick={() => setPage((page) => page + 1)}
                // Disabled if totalPages is 1 or if we are already on the last page
                disabled={Boolean(totalPages === 1 || sessions.length === total)} 
              >
                Load more
              </LoadingButton>
            ) : null}
          </Box>
        </>
      )}
    </>
  );
}

export default SessionList;