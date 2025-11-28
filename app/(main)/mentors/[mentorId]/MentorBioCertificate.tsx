import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { IMentorProfile } from "@/src/types/user";

// Define the type for the component's props
interface Props {
  selectedUser: IMentorProfile | null;
}

// --- Component ---

const MentorBioCertificate: React.FC<Props> = ({ selectedUser }) => {
  // Provide a default empty array to prevent errors if certifications is undefined
  const certificates = selectedUser?.certifications || [];

  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Certificates
      </Typography>
      <Divider sx={{ mb: 1.5 }} />
      {certificates.length > 0 ? (
        certificates.map((certi, index) => (
          // Added a key prop for each item in the list
          <Box key={`${certi.name}-${index}`}>
            <Typography variant="subtitle1">{certi.name}</Typography>
            <Typography
              variant="caption"
              component="a"
              href={certi.url}
              sx={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                wordBreak: "break-all", // Added to prevent long URLs from breaking layout
              }}
              target="_blank"
              rel="noopener noreferrer" // Added for security
            >
              {certi.url}
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ mt: 1 }}>
              {certi.description}
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
          </Box>
        ))
      ) : (
        <Typography variant="body1">No Certificates Yet</Typography>
      )}
    </Stack>
  );
};

export default MentorBioCertificate;