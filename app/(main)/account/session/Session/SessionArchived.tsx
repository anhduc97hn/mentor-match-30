import React from "react";
import SessionListWrapper from "./SessionListWrapper"; // Adjust path as needed
import { UserProfile } from "@/src/types/user";

function SessionArchived(userProfile: UserProfile) {
  return (
    <SessionListWrapper 
      userProfile={userProfile} 
      status="completed" // Key difference: pass the status to the wrapper
    />
  );
}

export default SessionArchived;