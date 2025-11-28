import React, { Suspense } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";
import { HeroSection } from "./HeroSection";
import { LogoSection } from "./LogoSection";
import { Container, Typography } from "@mui/material";
import { CtaSection } from "./CtaSection";
import { StatsSection } from "./StatsSection";
import FeaturedMentorList from "./FeaturedMentorList";
import "./HomePage.css"; 

export default async function HomePage() {
  return (
    <div>
      <HeroSection />
      <section className="mentor__section">
        <LogoSection />
        <div className="mentor__list">
          <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5, mb: 5 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: { xs: "center", md: "left" }, typography: { xs: "h6", md: "h5" } }}>
              Talk to the operators actively doing the work
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, textAlign: { xs: "center", md: "left" }, typography: { xs: "subtitle1", md: "h6" } }}>
              Get the kind of personalised advice you'd never find by passively binging content.
            </Typography>
            <Suspense fallback={<LoadingScreen />}>
              <FeaturedMentorList />
            </Suspense>
          </Container>
        </div>
        <CtaSection />
      </section>
      <StatsSection />
    </div>
  );
}
