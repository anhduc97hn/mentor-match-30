import React from "react";
import SessionListWrapper from "./SessionListWrapper"; // Adjust path as needed
import { UserProfile } from "@/src/types/user";

function SessionReviewed(userProfile: UserProfile) {
  return (
    <SessionListWrapper 
      userProfile={userProfile} 
      status="reviewed" // Key difference: pass the status to the wrapper
    />
  );
}

export default SessionReviewed;