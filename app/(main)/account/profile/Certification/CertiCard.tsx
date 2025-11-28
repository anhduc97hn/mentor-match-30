'use client'

import React, { useState, Dispatch, SetStateAction, RefObject } from "react";
import { Card, Typography, IconButton, Menu, MenuItem, CardContent, Grid } from "@mui/material";

import { fDate } from "@/src/utils/formatTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { certificationRemove } from "@/src/slices/resourceSlice";

import { Certification } from "@/src/types/user";
import { useAppDispatch } from "@/src/appService/hooks";
interface CertiCardProps {
  certi: Certification;
  setCurrentCerti: Dispatch<SetStateAction<Certification | null>>;
  certiFormRef: RefObject<HTMLDivElement | null>;
}

function CertiCard({ certi, setCurrentCerti, certiFormRef }: CertiCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const certiId = certi._id;
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "primary-card-menu";

  const handleCardOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditCard = (certiId: string) => {
    if (certiFormRef.current) {
      window.scrollTo({
        top: certiFormRef.current.offsetTop,
        behavior: "smooth",
      });
    }
    // Find the certification object from the list to set as the current one.
    // Assuming `setCurrentCerti` expects the full object, not just the ID.
    // The parent component (`CertiList`) would likely pass a function that finds the full object.
    setCurrentCerti(certi);
    handleMenuClose();
  };

  const handleDeleteCard = (certiId: string) => {
  
      const res = window.confirm("Are you sure you want to delete this information?");
      if (res) {
        dispatch(certificationRemove(certiId));
      }
    

    handleMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleEditCard(certiId)} sx={{ m: 1 }}>
        Edit
      </MenuItem>
      <MenuItem onClick={() => handleDeleteCard(certiId)} sx={{ m: 1 }}>
        Delete
      </MenuItem>
    </Menu>
  );

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
            <Typography variant="subtitle1" component="div" color="text.primary">
              {certi.name}
            </Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleCardOpen}>
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="subtitle2" color="text.secondary">
          {`Description: ${certi.description}`}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {`Website: ${certi.url}`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {certi.updatedAt !== certi.createdAt ? `Edited on ${fDate(certi.updatedAt)}` : `Created on ${fDate(certi.createdAt)}`}
        </Typography>
      </CardContent>
      {renderMenu}
    </Card>
  );
}

export default CertiCard;
