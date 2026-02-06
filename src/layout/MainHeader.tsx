'use client';
import React, { useState } from 'react';
import { AppBar, Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import Logo from '../components/Logo';
import NextLink from "next/link"
import LoginIcon from '@mui/icons-material/Login';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const MainHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const auth = useAuth();
  const { userProfile } = auth;
  const router = useRouter();
  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'account-menu';

  const handleProfileMenuToggle = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      auth.logout(() => {
        router.push('/');
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickLogin = async () => {
    router.push("/login", { scroll: true });
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle1" noWrap>
          {userProfile?.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }} noWrap>
          {userProfile?.userId?.email}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <MenuItem onClick={handleMenuClose} href="/account/profile" component={NextLink} sx={{ mx: 1 }}>
        My Profile
      </MenuItem>

      <MenuItem onClick={handleMenuClose} href="/account/session" component={NextLink} sx={{ mx: 1 }}>
        My Sessions
      </MenuItem>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
        Log out
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky" color="inherit" sx={{ mb: 0.5, zIndex: "tooltip", top: 0, left: 0 }}>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
          <Logo />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
          MENTOR MATCH
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button component={NextLink} href="/mentors" variant="contained" sx={{ mr: 2 }} prefetch={false}>
          Browse Mentors
        </Button>

        {userProfile ? (
          <Box>
            <Avatar
              onClick={handleProfileMenuToggle}
              src={userProfile?.avatarUrl as string}
              alt={userProfile?.name}
              sx={{
                width: 32,
                height: 32,
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  cursor: "pointer",
                },
              }}
            />
          </Box>
        ) : (
          <Button onClick={handleClickLogin} variant="contained" startIcon={<LoginIcon />}>
            Login
          </Button>
        )}
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
};

export default MainHeader;
