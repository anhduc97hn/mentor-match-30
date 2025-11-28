'use client'

import React, { ReactNode } from "react";
import isString from "lodash/isString"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone";
import { Typography, Box, SxProps, Theme } from "@mui/material";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { styled, alpha } from "@mui/material/styles";
// Assuming RejectionFiles is also a TSX component that accepts FileRejection[]
import RejectionFiles from "./RejectionFiles"; 

// --- Types ---

// Define the structure for the 'file' prop. 
// It can be a string (for a URL) or an object with a 'preview' string (from useDropzone)
type FileValue = string | (File & { preview: string });

// Define the props for the UploadAvatar component
interface UploadAvatarProps extends Omit<DropzoneOptions, 'multiple'> {
  error?: boolean;
  file: FileValue | null; // Allow null when no file is present
  helperText?: ReactNode; // Helper text can be any React node (string, element, etc.)
  sx?: SxProps<Theme>; // Standard MUI SxProps type
}

// --- Styled Components (No change needed for styled components in TSX) ---

const RootStyle = styled("div")(({ theme }) => ({
  width: 144,
  height: 144,
  margin: "auto",
  borderRadius: "50%",
  padding: theme.spacing(1),
  border: `1px dashed ${alpha("#919EAB", 0.32)}`,
}));

const DropZoneStyle = styled("div")({
  zIndex: 0,
  width: "100%",
  height: "100%",
  outline: "none",
  display: "flex",
  overflow: "hidden",
  borderRadius: "50%",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  "& > *": { width: "100%", height: "100%" },
  "&:hover": {
    cursor: "pointer",
    "& .placeholder": {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled("div")(({ theme }) => ({
  display: "flex",
  position: "absolute",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  color: "#919EAB",
  backgroundColor: "#919EAB",
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": { opacity: 0.72 },
}));

// --- TSX Component ---

function UploadAvatar({ error, file, helperText, sx, ...other }: UploadAvatarProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections, // fileRejections is inferred as FileRejection[] by useDropzone
  } = useDropzone({
    multiple: false, // Enforce single file selection
    ...other, // Pass other props like 'onDrop', 'accept', etc.
  });

  // Type assertion for fileRejections for safety, though often inferred correctly
  const rejections = fileRejections as FileRejection[]; 

  return (
    <>
      <RootStyle
        sx={{
          ...((isDragReject || error) && {
            borderColor: "error.light",
          }),
          ...sx,
        }}
      >
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
          }}
        >
          <input {...getInputProps()} />

          {file && (
            <Box
              sx={{
                zIndex: 8,
                overflow: "hidden",
                "& img": { objectFit: "cover", width: 1, height: 1 },
              }}
            >
              <img 
                alt="avatar" 
                // Check if file is a string (URL) or a File object with a preview property
                src={isString(file) ? file : file.preview} 
              />
            </Box>
          )}

          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: "common.white",
                bgcolor: "grey.900",
                "&:hover": { opacity: 0.72 },
              }),
              ...((isDragReject || error) && {
                bgcolor: "error.lighter",
              }),
            }}
          >
            <AddAPhotoRoundedIcon sx={{ width: 24, height: 24, mb: 1 }} />
            <Typography variant="caption">
              {file ? "Update photo" : "Upload photo"}
            </Typography>
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {/* Helper Text */}
      {helperText && helperText}

      {/* File Rejections */}
      {rejections.length > 0 && (
        <RejectionFiles fileRejections={rejections} />
      )}
    </>
  );
}

export default UploadAvatar;