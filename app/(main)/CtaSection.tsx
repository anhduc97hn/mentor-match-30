import { Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export const CtaSection = () => (
  <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5, mb: 5 }}>
    <Typography variant="h5" sx={{ textAlign: "center", typography: { xs: "h6", md: "h5" } }}>
      Want to browse the rest of the mentors?
    </Typography>
    <Button variant="outlined" sx={{ mt: 3 }} component={Link} href="/mentors">
      BROWSE +100 MENTORS BEFORE JOINING
    </Button>
  </Container>
);
