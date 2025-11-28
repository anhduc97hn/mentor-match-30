import { Avatar, Box, Button, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import MentorChip from "./MentorChip";
import { fData } from "@/src/utils/numberFormat";
import useAuth from "@/src/hooks/useAuth";
import { IMentorProfile } from "@/src/types/user";

interface Props {
  mentor: IMentorProfile;
}

interface InfoTab {
  value: "Certifications" | "Industry" | "Education";
  component: React.ReactNode;
  icon?: React.ReactElement;
}

const MentorCard: React.FC<Props> = ({ mentor }) => {
  const { userProfile } = useAuth();
  const currentUserProfileId = userProfile?._id;
  const [currentTab, setCurrentTab] = useState("Certifications");
  const mentorId = mentor._id;

  const certifications = mentor.certifications || [];
  const certificationNames = certifications.map((certi) => certi.name);

  const experiences = mentor.experiences || [];
  const industryNames = experiences.map((exp) => exp.industry);

  const education = mentor.education || [];
  const educationFields = education.map((edu) => edu.field);

  const INFO_TABS: InfoTab[] = [
    {
      value: "Certifications",
      component: <MentorChip labels={certificationNames} />,
    },
    {
      value: "Industry",
      component: <MentorChip labels={industryNames} />,
    },
    {
      value: "Education",
      component: <MentorChip labels={educationFields} />,
    },
  ];

  const fRating = mentor.reviewAverageRating ? fData(mentor.reviewAverageRating) : "N/A";

  const handleTabChange = (_: unknown, newValue: any) => {
    setCurrentTab(newValue);
  };

  return (
    <Card sx={{ mt: 2, padding: 2 }}>
      <Stack direction="row" spacing={2}>
        <Avatar src={mentor.avatarUrl as string} alt={mentor.name} sx={{ width: 50, height: 50 }} />
        <Box flexGrow={1}>
          <Typography variant="subtitle2" color="primary" component={Link} sx={{ fontWeight: 600, textDecoration: "none" }} href={`/mentors/${mentorId}`}>
            {mentor.name}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
            {mentor.currentPosition} at {mentor.currentCompany}
          </Typography>
        </Box>
        <Stack>
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <StarIcon sx={{ color: "primary.main", mr: 0.5, fontSize: "1.2rem" }} />
            <Typography variant="h6">{fRating}</Typography>
          </Stack>
          <Typography variant="caption" sx={{ textAlign: "right" }}>
            {mentor.reviewCount} reviews / {mentor.sessionCount} sessions
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
        {mentor.aboutMe}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={{ xs: 2, sm: 0 }}>
        <Box>
          <Tabs value={currentTab} scrollButtons="auto" variant="scrollable" allowScrollButtonsMobile onChange={handleTabChange}>
            {INFO_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {INFO_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return (
              isMatched && (
                <Box key={tab.value} sx={{ mt: 1.5 }}>
                  {tab.component}
                </Box>
              )
            );
          })}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flexShrink: 0,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button variant="contained" component={Link} href={`/mentors/${mentorId}/session`} disabled={currentUserProfileId === mentorId}>
            Request a Call
          </Button>
          <Button variant="outlined" component={Link} href={`/mentors/${mentorId}`}>
            View Profile
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default MentorCard;
