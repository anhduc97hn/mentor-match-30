"use client"

import React from 'react';
import { Link as MUILink, Typography } from "@mui/material";
import Link from "next/link"

const MainFooter: React.FC = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" p={1} mt={2} mb={2}>
      {"Copyright © "}
      <MUILink color="inherit" href="/" component={Link}>
        Duc Nguyen
      </MUILink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default MainFooter;