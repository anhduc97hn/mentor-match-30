import React, { useEffect, Dispatch, SetStateAction, RefObject } from 'react';
import { Box, Card, alpha, Stack } from '@mui/material';
import { FormProvider, FTextField } from '@/src/components/form';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { certificationCreate, certificationUpdate } from '@/src/slices/resourceSlice';
import { LoadingButton } from '@mui/lab';
import { Certification, IDocument } from '@/src/types/user';
import { useAppDispatch, useAppSelector } from '@/src/appService/hooks';

const CertiSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  url: Yup.string().url('Invalid URL'),
});

interface CertiFormData {
  name: string;
  description: string;
  url: string | undefined;
}

const defaultValues: CertiFormData = {
  name: '',
  description: '',
  url: '',
};

// Define the types for the component's props
interface CertiFormProps {
  currentCerti: Certification | null;
  setCurrentCerti: Dispatch<SetStateAction<Certification | null>>;
  certiFormRef: RefObject<HTMLDivElement | null>;
}

function CertiForm({ currentCerti, setCurrentCerti, certiFormRef }: CertiFormProps) {
  const { dataById, isLoading } = useAppSelector(state => state.certification);

  const updatedCertiId = currentCerti ? ((dataById as Record<string, Certification>)[currentCerti._id] ? currentCerti._id : null) : null;

  const methods = useForm({
    resolver: yupResolver(CertiSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (updatedCertiId) {
      const updatedCerti = (dataById as Record<string, Certification>)[updatedCertiId];
      if (updatedCerti) {
        setValue('name', updatedCerti.name);
        setValue('description', updatedCerti.description);
        setValue('url', updatedCerti.url);
      }
    } else {
      reset();
    }
  }, [updatedCertiId, dataById, setValue, reset]);

  const renderDynamicFields = (fields: CertiFormData, prefix = '') => {
    return Object.keys(fields).map(fieldName => (
      <FTextField
        key={prefix + fieldName}
        name={`${prefix}${fieldName}`}
        fullWidth
        label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        sx={{
          '& fieldset': {
            borderWidth: `1px !important`,
            borderColor: alpha('#919EAB', 0.32),
          },
        }}
      />
    ));
  };

  const onSubmit = (data: any) => {
    if (updatedCertiId) {
      const updatedCerti = (dataById as Record<string, Certification>)[updatedCertiId];
      if (updatedCerti) {
        const fullUpdateData: Certification = {
          ...updatedCerti, // Includes _id, createdAt, etc.
          ...data, // Overwrites editable fields (name, description, url)
        };
        dispatch(certificationUpdate({ itemId: updatedCertiId, data: fullUpdateData }));
        setCurrentCerti(null);
        reset();
      }
    } else {
      dispatch(certificationCreate(data));
      reset();
    }
  };

  const handleCancelEditing = () => {
    setCurrentCerti(null);
    reset();
  };

  return (
    <div ref={certiFormRef}>
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {renderDynamicFields(defaultValues)}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <LoadingButton type="submit" variant="contained" size="small" loading={isSubmitting || isLoading}>
                {updatedCertiId ? 'Save Changes' : 'Create'}
              </LoadingButton>
              {updatedCertiId && (
                <LoadingButton variant="contained" color="error" size="small" loading={isSubmitting || isLoading} onClick={handleCancelEditing}>
                  Cancel editing
                </LoadingButton>
              )}
            </Box>
          </Stack>
        </FormProvider>
      </Card>
    </div>
  );
}

export default CertiForm;
