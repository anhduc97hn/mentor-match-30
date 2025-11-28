'use client'

import React, { useState, Dispatch, SetStateAction, RefObject } from "react";
import { Card, Typography, IconButton, Menu, MenuItem, CardContent, Grid } from "@mui/material";

import { fDate } from "@/src/utils/formatTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { educationRemove } from "@/src/slices/resourceSlice";
import { Education } from "@/src/types/user";
import { useAppDispatch } from "@/src/appService/hooks";

// Define the types for the component's props.
interface EduCardProps {
  edu: Education;
  setCurrentEdu: Dispatch<SetStateAction<Education | null>>;
  eduFormRef: RefObject<HTMLDivElement | null>;
}

function EduCard({ edu, setCurrentEdu, eduFormRef }: EduCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const eduId = edu._id;
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "primary-card-menu";

  const handleCardOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditCard = (eduId: string) => {
    if ( eduFormRef.current) {
      window.scrollTo({
        top: eduFormRef.current.offsetTop,
        behavior: "smooth",
      });
    }
    // Set the full education object for editing.
    setCurrentEdu(edu);
    handleMenuClose();
  };

  const handleDeleteCard = (eduId: string) => {
   
      const res = window.confirm("Are you sure you want to delete this information?");

      if (res) {
        dispatch(educationRemove(eduId));
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
      <MenuItem onClick={() => handleEditCard(eduId)} sx={{ m: 1 }}>
        Edit
      </MenuItem>
      <MenuItem onClick={() => handleDeleteCard(eduId)} sx={{ m: 1 }}>
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
              {edu.field}
            </Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleCardOpen}>
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="subtitle2" color="text.secondary">
          {`Degree: ${edu.degree}`}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {`Description: ${edu.description}`}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {`End date: ${edu.end_year}`}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {`Website: ${edu.url}`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {edu.updatedAt !== edu.createdAt ? `Edited on ${fDate(edu.updatedAt)}` : `Created on ${fDate(edu.createdAt)}`}
        </Typography>
      </CardContent>
      {renderMenu}
    </Card>
  );
}

export default EduCard;
