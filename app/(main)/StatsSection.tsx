import { Box, Container, Stack, Typography } from "@mui/material";

export const StatsSection = () => (
  <section className="numbers__section">
    <Container>
      <Stack flexDirection={{ xs: "column", md: "row" }} gap={3} alignItems="center" justifyContent="center" textAlign="center" sx={{ mt: 5, mb: 5 }}>
        {[
          { num: "33,000+", label: "Sessions booked since 2018" },
          { num: "27", label: "Events organised around the world by our community" },
          { num: "4.7", label: "Average sessions / month per mentee" },
        ].map((stat, idx) => (
          <Box key={idx}>
            <Typography variant="h2">{stat.num}</Typography>
            <Typography variant="subtitle1">{stat.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  </section>
);
