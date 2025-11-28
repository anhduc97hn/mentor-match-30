import { IMentorProfile } from "@/src/types/user";
import { Stack, Typography } from "@mui/material";
import React from "react";


// Define the type for the component's props.
interface Props {
  selectedUser: IMentorProfile | null;
}

// --- Component ---

const MentorBioProfile: React.FC<Props> = ({ selectedUser }) => {
  // The default value provides a fallback if aboutMe is null or undefined.
  const aboutMe = selectedUser?.aboutMe || "No bio available";

  return (
    <Stack spacing={3}>
      <embed
        width="100%"
        height="480"
        src="https://www.youtube.com/embed/euCvvEROOXM" // This URL is hardcoded, consider making it a prop if it needs to be dynamic.
        title="Mentor Introduction Video" // Added title for accessibility.
      />
      <Typography variant="h6">Bio</Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}> 
        {/* Using pre-line to respect newlines in the bio text */}
        {aboutMe}
      </Typography>
    </Stack>
  );
};

export default MentorBioProfile;