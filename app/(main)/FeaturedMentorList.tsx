import { Grid } from "@mui/material";
import React from "react";
import FeaturedMentorCard from "./FeaturedMentorCard";
import { fetchFeaturedMentors } from "@/src/data/user";

const FeaturedMentorList = async () => {
  const { currentHomePageUsers, userProfilesById } = await fetchFeaturedMentors();
  const userProfiles = currentHomePageUsers.map((id) => userProfilesById[id]);
  return (
    <Grid container spacing={3.5}>
      {userProfiles.map((userProfile) => (
        <Grid key={userProfile._id} size={{ lg: 4, md: 4, xs: 6 }}>
          <FeaturedMentorCard userProfile={userProfile} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturedMentorList;
