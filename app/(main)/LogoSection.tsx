import { Box, Container, Stack, Typography } from "@mui/material";

export const LogoSection = () => {
  const logos = [
    { src: "/assets/appsumo-logo.jpg", alt: "appsumo" },
    { src: "/assets/semrush-logo.jpg", alt: "semrush" },
    { src: "/assets/coderschool-logo.png", alt: "coderschool" },
    { src: "/assets/spotify-logo.png", alt: "spotify" },
    { src: "/assets/netflix-logo.png", alt: "netflix" },
    { src: "/assets/grab-logo.png", alt: "grab" },
  ];
  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5, mb: 2 }}>
      <Typography variant="h5" sx={{ textAlign: "center", typography: { xs: "h6", md: "h5" } }}>
        Get instant access to startup mentors from amazing companies like:
      </Typography>
      <Stack flexDirection="row" gap={3} alignItems="center" justifyContent="center">
        {logos.map((logo, index) => (
          <Box key={index} sx={{ width: "15%", minWidth: "80px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={logo.src} alt={logo.alt} width="100%" />
          </Box>
        ))}
      </Stack>
    </Container>
  );
};
