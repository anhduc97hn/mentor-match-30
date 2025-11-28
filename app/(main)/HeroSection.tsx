import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const HeroSection = () => (
  <section className="hero__section">
    <Container sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, alignItems: "center", py: 5, gap: 5 }}>
      <Box sx={{ width: { xs: "100%", lg: "570px" }, display: "flex", flexDirection: "column" }} gap={5}>
        <Typography variant="h1" sx={{ textAlign: { xs: "center", lg: "left" }, typography: { xs: "h3", md: "h1" } }}>
          Grow your startup faster with 1:1 mentorship
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: { xs: "center", lg: "left" } }}>
          Pick the brains of mentors who have driven growth at some of the world's leading startups. See the blind spots in your decision-making
        </Typography>
        <Stack flexDirection="row" gap={2} sx={{ justifyContent: { xs: "center", lg: "left" } }}>
          <Button variant="outlined" component={Link} href="/login">
            Get Started & Get Growing {">"}
          </Button>
          <Button variant="outlined" component={Link} href="https://www.youtube.com/watch?v=x9kQ8m2ex4k&t=35s" target="_blank">
            What people are saying
          </Button>
        </Stack>
        <Stack sx={{ textAlign: { xs: "center", lg: "left" } }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            WITH HUNDREDS OF MENTORS JUST A CLICK AWAY, YOU CAN:
          </Typography>
          {["Validate ideas before executing", "Get personalized advice for your situation", "Get clarity on things you're struggling with", "Skip the trial-and-error of doing it yourself"].map((text) => (
            <Typography key={text} variant="subtitle1" sx={{ mb: 1 }}>
              ✓ {text}
            </Typography>
          ))}
        </Stack>
      </Box>
      <Box sx={{ width: "45%", display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
        <img src="/assets/hero-img.jpg" alt="hero__img" width="100%" />
      </Box>
    </Container>
  </section>
);
