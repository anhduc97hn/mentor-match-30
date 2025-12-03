"use client"

import React, { ReactNode }  from 'react';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import { Box, Stack } from "@mui/material";
import AlertMsg from "../components/AlertMsg";
import { UserProfile } from '../types/user';
import AuthSync from '../components/AuthSync';

interface MainLayoutProps {
  children: React.ReactNode;
  // initialAuthState: {
  //   userProfile: UserProfile | null;
  //   isAuthenticated: boolean;
  //    isInitialized: boolean
  // }
}

const MainLayout = ({children}: MainLayoutProps) => {
  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <MainHeader />
      <AlertMsg />
      {children}
      <Box sx={{ flexGrow: 1, bgcolor: "primary.light" }} />
      <MainFooter />
    </Stack>
  );
};

export default MainLayout;