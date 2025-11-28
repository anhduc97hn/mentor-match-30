// SessionCanceled.tsx
import React from "react";
import SessionListWrapper from "./SessionListWrapper"; // Adjust path as needed
import { UserProfile } from "@/src/types/user";

function SessionCanceled(userProfile: UserProfile) {
  return (
    <SessionListWrapper 
      userProfile={userProfile} 
      status="cancelled" // Key difference: pass the status to the wrapper
    />
  );
}

export default SessionCanceled;