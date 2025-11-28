"use client"

import React  from 'react';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
// import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import AlertMsg from "../components/AlertMsg";

const MainLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <MainHeader />
      <AlertMsg />
      {/* <Outlet/> */}
      {children}
      <Box sx={{ flexGrow: 1, bgcolor: "primary.light" }} />
      <MainFooter />
    </Stack>
  );
};

export default MainLayout;