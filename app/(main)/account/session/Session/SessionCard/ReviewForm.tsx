"use client"; // Marks this as a client component

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormProvider from "@/src/components/form/FormProvider";
import FTextField from "@/src/components/form/FTextField"
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, SxProps, Theme } from '@mui/material'; // Import SxProps and Theme for typing
import { LoadingButton } from '@mui/lab';
import FRating from '@/src/components/form/FRating';
import { useDispatch } from 'react-redux';
// Assuming createReview is an async thunk that returns a promise
import { createReview } from '@/src/slices/reviewSlice'; 
import { useAppDispatch } from '@/src/appService/hooks';

// Define the interface for the form data
interface ReviewFormInputs {
  rating: number;
  content: string;
}

// Define the interface for the component's props
interface ReviewFormProps {
    children: React.ReactNode;
    sessionId: string;
}

// Type the MUI style object
const style: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '1px solid #9DA4AE',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const ReviewSchema = Yup.object().shape({
    // Use .nullable() if default value is null and you want to allow it initially
    rating: Yup.number().required("Please rate your experience").min(1, "Please rate your experience"),
    content: Yup.string().required("Please write your review, we will take it seriously!")
  });
  
  const defaultValues: ReviewFormInputs = {
    rating: 5,
    content: ""
  };

export default function ReviewForm({children, sessionId}: ReviewFormProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset(); // Reset form when closing the modal
  };
  const dispatch = useAppDispatch();

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: ReviewFormInputs) => {
    const { content, rating } = data;
    await dispatch(
      // Ensure your createReview thunk expects these types
      createReview({ content, rating, sessionId, prevStatus: "completed"}) 
    );
      reset();
      handleClose(); // Close modal on successful submission
   
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>{children}</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
       <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Fade in={open}>
          <Box sx={style}>
          {!!errors.root?.responseError && (
            <Alert severity="error">{errors.root.responseError.message}</Alert>
          )}
            <Typography id="transition-modal-title" variant="h6" sx={{mt: 1, mb: 1}}>
              Please rate your overall experience
            </Typography>
            <FRating name="rating" sx={{mb: 3}} />
            <FTextField name="content" label="Please share your feedback" multiline rows={4}/>
            <LoadingButton
            sx={{mt: 3}}
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Thanks for sharing your thoughts
          </LoadingButton>
          </Box>
        </Fade>
        </FormProvider>
      </Modal>
      
    </div>
  );
}