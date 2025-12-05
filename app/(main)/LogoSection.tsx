import { Box, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";

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
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, mb: 2}}>
      <Typography variant="h5" sx={{ textAlign: "center", typography: { xs: "h6", md: "h5" } }}>
        Get instant access to startup mentors from amazing companies like:
      </Typography>
      <Stack flexDirection="row" alignItems="center" justifyContent="center" flexWrap="wrap">
        {logos.map((logo, index) => (
          <Box key={index} sx={{ width: { xs: "20%", sm: "15%" }, minWidth: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <Image src={logo.src} alt={logo.alt} fill={true} style={{ objectFit: "contain"}}  />
          </Box>
        ))}
      </Stack>
    </Container>
  );
};
