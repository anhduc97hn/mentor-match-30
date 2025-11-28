"use client"

import { Stack } from '@mui/material';
import React from 'react';
import { Outlet } from "react-router-dom";
import Logo from '../components/Logo';
import AlertMsg from "../components/AlertMsg";

const BlankLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <Stack minHeight="100vh" justifyContent="center" alignItems="center" sx={{pt: 2, pb: 2}}>
      <AlertMsg />
      <Logo sx={{ width: 90, height: 90, mb: 5 }} />
      {/* <Outlet /> */}
      {children}
    </Stack>
  );
};

export default BlankLayout;