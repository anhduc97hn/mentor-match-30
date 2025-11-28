import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
import React from "react";

interface LoadingScreenProps {
  sx?: SxProps<Theme>;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ sx }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...sx
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;