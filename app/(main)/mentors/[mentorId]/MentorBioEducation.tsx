import React from "react";
import { Divider, Stack, Typography } from "@mui/material";
import { fDateToMonthYear } from "@/src/utils/formatTime";
import { IMentorProfile } from "@/src/types/user";


// Define the type for the component's props
interface Props {
  selectedUser: IMentorProfile | null;
}

// --- Component ---

const MentorBioEducation: React.FC<Props> = ({ selectedUser }) => {
  // Provide a default empty array to prevent errors if education is undefined
  const education = selectedUser?.education || [];

  return (
    <Stack>
      <Typography variant="h6" gutterBottom>
        Education
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {education.length > 0 ? (
        education.map((edu, index) => {
          const endYear = edu.end_year;
          // Ensure endYear is a string before parsing
          const isValidDate = typeof endYear === 'string' && !isNaN(Date.parse(endYear));

          const formattedEndYear = isValidDate
            ? fDateToMonthYear(new Date(endYear as string))
            : endYear || "";

          return (
            // Use React.Fragment with a key for list items
            <React.Fragment key={`${edu.degree}-${index}`}>
              <Typography variant="subtitle1">Field: {edu.field}</Typography>
              <Stack flexDirection="row" justifyContent="space-between">
                <Typography variant="subtitle2">
                  Degree: {edu.degree}
                </Typography>
                <Typography variant="subtitle2">
                  Graduation: {formattedEndYear}
                </Typography>
              </Stack>
              <Typography variant="body2" gutterBottom sx={{ mt: 1 }}>
                Description: {edu.description}
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  mt: 1,
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  wordBreak: "break-all",
                }}
                component="a"
                href={edu.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Organization: {edu.url}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </React.Fragment>
          );
        })
      ) : (
        <Typography variant="body1">No Education History Yet</Typography>
      )}
    </Stack>
  );
};

export default MentorBioEducation;