import { Avatar, Box, Link as MUILink, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import { UserProfile } from "@/src/types/user";

interface Props {
  userProfile: UserProfile;
}

const FeaturedMentorCard: React.FC<Props> = ({ userProfile }) => {

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Avatar src={userProfile.avatarUrl as string} alt={userProfile.name} sx={{ width: "80px", height: "80px" }} />
      <MUILink
        component={Link}
        variant="subtitle1"
        color="text.primary"
        href={`/mentors/${userProfile._id}`}
        style={{ textDecoration: "none" }}
        sx={{
          fontWeight: 600,
          mt: 1,
          textAlign: "center",
          "&:hover": {
            color: "primary.main",
          },
          transition: "color 0.3s ease",
        }}
        prefetch={false}
      >
        {userProfile.name}
      </MUILink>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", textAlign: "center" }}
      >
        {userProfile.currentPosition} at {userProfile.currentCompany}
      </Typography>
    </Box>
  );
}

export default FeaturedMentorCard;
