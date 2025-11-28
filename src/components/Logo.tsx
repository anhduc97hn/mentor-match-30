import Link from "next/link";
import { Box, SxProps, Theme } from "@mui/material";
import Image from "next/image"

interface LogoProps {
  disabledLink?: boolean;
  sx?: SxProps<Theme>;
}

const Logo: React.FC<LogoProps> = ({ disabledLink = false, sx }) => {
  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img src="/logo.png" alt="logo" width="100%" />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <Link href="/">{logo}</Link>;
};

export default Logo;