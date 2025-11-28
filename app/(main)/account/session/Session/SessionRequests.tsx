import React from "react";
import SessionListWrapper from "./SessionListWrapper"; // Adjust path as needed
import { UserProfile } from "@/src/types/user";

function SessionRequests(userProfile: UserProfile) {
  return (
    <SessionListWrapper 
      userProfile={userProfile} 
      status="pending" // Key difference: pass the status to the wrapper
    />
  );
}

export default SessionRequests;