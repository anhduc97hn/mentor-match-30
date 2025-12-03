'use client';

import React, { useState } from 'react';
import { Alert, Card, Container, Divider, Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FTextField from '@/src/components/form/FTextField';
import FormProvider from '@/src/components/form/FormProvider';
import FDateTimePicker from '@/src/components/form/FDateTimePicker';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAppDispatch } from '@/src/appService/hooks';
import { sendSessionRequest } from '@/src/slices/sessionSlice';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/src/types/user'; 
import MentorInfo from './MentorInfo'; 

// --- Validation Schema ---
const RequestSchema = Yup.object().shape({
  topic: Yup.string().required('Please enter a topic for this session'),
  problem: Yup.string().required('Please write a brief for your topic'),
  startDateTime: Yup.date().required('Please select your preferred timeslot'),
  endDateTime: Yup.date().required(),
});

type SessionRequestFormInputs = Yup.InferType<typeof RequestSchema>;

const defaultValues: SessionRequestFormInputs = {
  topic: '',
  problem: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
};

interface SessionRequestFormProps {
  mentorId: string;
  mentor: UserProfile;
}

export default function SessionRequestForm({ mentorId, mentor }: SessionRequestFormProps) {
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const methods = useForm<SessionRequestFormInputs>({
    resolver: yupResolver(RequestSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const handleStartDateTimeChange = (value: Date) => {
    if (value) {
      const startDate = new Date(value);
      startDate.setHours(startDate.getHours() + 1); // Auto-calculate 1 hour

      setEndDateTime(startDate);
      setValue('startDateTime', value, { shouldValidate: true });
      setValue('endDateTime', startDate);
    }
  };

  const onSubmit = async (data: SessionRequestFormInputs) => {
    try {
      await dispatch(sendSessionRequest({ userProfileId: mentorId, data }));
      router.push('/account/session');
    } catch (error: any) {
      reset();
      setError('root.responseError', {
        type: 'manual',
        message: error.message || 'Failed to send session request',
      });
    }
  };

  return (
    <Container maxWidth={false} sx={{ bgcolor: 'primary.light', p: 5 }}>
      <Card sx={{ p: 5, mx: 'auto', maxWidth: '800px' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          
          {!!errors.root?.responseError && (
            <Alert severity="error">{errors.root.responseError.message}</Alert>
          )}

          <Typography variant="h5" gutterBottom>
            Session details
          </Typography>

          <MentorInfo mentor={mentor} />

          <Divider sx={{ mt: 3, mb: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            Schedule Session
          </Typography>
          <Typography variant="body2" gutterBottom>
            Sessions should be scheduled at least 24 hours in advance.
          </Typography>

          <FDateTimePicker 
            sx={{ mt: 2, display: 'block' }} 
            label="Select Start Date/Time" 
            name="startDateTime" 
            disablePast={true} 
            onChange={handleStartDateTimeChange} 
          />
          
          <FDateTimePicker 
            sx={{ mt: 2 }} 
            label="End Date/Time (1 hour session)" 
            name="endDateTime" 
            value={endDateTime} 
            disabled={true} 
          />

          <Divider sx={{ mt: 3, mb: 3 }} />

          <Stack spacing={3}>
            <FTextField name="topic" label="Topic" />
            <FTextField 
              name="problem" 
              label="Problem/challenge" 
              multiline 
              rows={4} 
            />
          </Stack>

          <LoadingButton 
            sx={{ mt: 3 }} 
            type="submit" 
            variant="contained" 
            loading={isSubmitting}
          >
            Confirm session request
          </LoadingButton>

        </FormProvider>
      </Card>
    </Container>
  );
}