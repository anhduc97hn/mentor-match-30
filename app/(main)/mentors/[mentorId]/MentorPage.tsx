"use client";

import { Box, Button, Card, Container, IconButton, Stack, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import MentorBioProfile from "./MentorBioProfile";
import MentorBioEducation from "./MentorBioEducation";
import MentorBioExperience from "./MentorBioExperience";
import MentorBioCertificate from "./MentorBioCertificate";
import MentorBioReviews from "./MentorBioReviews";
// import './MentorPage.css';
import useAuth from "@/src/hooks/useAuth";
import { UserProfile, IMentorProfile } from "@/src/types/user";
import Link from "next/link";

interface MentorTab {
  value: string;
  component: React.ReactNode;
  icon?: React.ReactElement;
}

interface MentorPageProps {
  mentorProfile: IMentorProfile;
  mentorId: string;
}

const MentorPage: React.FC<MentorPageProps> = ({ mentorProfile, mentorId }) => {
  const { userProfile } = useAuth();
  const currentUserProfileId = userProfile?._id;
  const [currentTab, setCurrentTab] = useState<string>("Profile");
  const MENTOR_TABS: MentorTab[] = [
    {
      value: "Profile",
      component: <MentorBioProfile selectedUser={mentorProfile} />,
    },
    {
      value: "Education",
      component: <MentorBioEducation selectedUser={mentorProfile} />,
    },
    {
      value: "Experience",
      component: <MentorBioExperience selectedUser={mentorProfile} />,
    },
    {
      value: "Certificate",
      component: <MentorBioCertificate selectedUser={mentorProfile} />,
    },
    {
      value: `Reviews (${mentorProfile?.reviewCount || 0})`,
      component: <MentorBioReviews selectedUser={mentorProfile} />,
    },
  ];
  const handleTabChange = (_: unknown, newValue: string) => {
    setCurrentTab(newValue);
  };
  return (
    <Container sx={{ width: { xs: "90vw", md: "70vw" }, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
        <Button variant="contained" component={Link} href={`/mentors/${mentorId}/session`} disabled={currentUserProfileId === mentorId} sx={{ width: { xs: "100%", md: "auto" } }}>
          Request a Call
        </Button>
        <Stack direction="row" spacing={1}>
          <IconButton component="a" href={mentorProfile.linkedinLink} target="_blank" color="primary">
            <LinkedInIcon />
          </IconButton>
          <IconButton component="a" href={mentorProfile.twitterLink} target="_blank" color="primary">
            <TwitterIcon />
          </IconButton>
          <IconButton component="a" href={mentorProfile.instagramLink} target="_blank" color="primary">
            <InstagramIcon />
          </IconButton>
          <IconButton component="a" href={mentorProfile.facebookLink} target="_blank" color="primary">
            <FacebookIcon />
          </IconButton>
        </Stack>
      </Stack>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
      <Tabs value={currentTab} scrollButtons="auto" variant="scrollable" allowScrollButtonsMobile onChange={handleTabChange}>
        {MENTOR_TABS.map((tab) => (
          <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      </Stack>
      <Box sx={{ bgcolor: "primary.light", width: "100%", flexGrow: 1, p: { xs: 1, md: 5 } }}>
        {MENTOR_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return (
            isMatched && (
              <Card key={tab.value} sx={{ mx: "auto", maxWidth: "800px", p: 2 }}>
                {tab.component}
              </Card>
            )
          );
        })}
      </Box>
      </Container>
  );
};

export default MentorPage;
