import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import { fDateToMonthYear } from "@/src/utils/formatTime";
import { IMentorProfile } from "@/src/types/user";

// Define the type for the component's props
interface Props {
  selectedUser: IMentorProfile | null;
}

// --- Component ---

const MentorBioExperience: React.FC<Props> = ({ selectedUser }) => {
  // Provide a default empty array to prevent errors if experiences is undefined
  const experiences = selectedUser?.experiences || [];

  return (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Experience
      </Typography>
      {experiences.length > 0 ? (
        experiences.map((exp) => {
          // convert date format for friendly UI
          const startDate = exp.position.start_date;
          const endDate = exp.position.end_date;
          const isValidStartDate = !isNaN(Date.parse(startDate));
          const isValidEndDate = !isNaN(Date.parse(endDate));

          const fStartDate = isValidStartDate
            ? fDateToMonthYear(new Date(startDate))
            : startDate || "";
          
          // Bug Fix: Check against endDate, not startDate
          const fEndDate = isValidEndDate
            ? fDateToMonthYear(new Date(endDate))
            : endDate || "Present";

          return (
            <Card
              sx={{ borderRadius: 0.5, border: "1px solid #F3F4F6", p: 1.5 }}
              key={exp._id}
            >
              <Box>
                <Stack flexDirection="row" justifyContent="space-between">
                  <Typography variant="subtitle1">{exp.company}</Typography>
                  <Typography variant="body2">{exp.location}</Typography>
                </Stack>

                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  {exp.position.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {fStartDate} - {fEndDate}
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  // Bug Fix: Use curly braces {} for the href prop
                  href={exp.url}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    display: 'block', // To make it take up its own line
                    wordBreak: 'break-all'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {exp.url}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {exp.position.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip label={exp.industry} variant="outlined" size="small" />
              </Stack>
            </Card>
          );
        })
      ) : (
        <Typography variant="body1">No Experience Yet</Typography>
      )}
    </Stack>
  );
};

export default MentorBioExperience;