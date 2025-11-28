import React, { useEffect, Dispatch, SetStateAction, RefObject } from "react";
import { Box, Card, alpha, Stack } from "@mui/material";
import { FormProvider, FTextField } from "@/src/components/form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { educationCreate, educationUpdate } from "@/src/slices/resourceSlice";
import { LoadingButton } from "@mui/lab";
import { Education } from "@/src/types/user";
import { useAppDispatch, useAppSelector } from "@/src/appService/hooks";


// Define the shape of the form data
interface EduFormData {
  degree: string;
  field: string;
  description: string;
  end_year: string;
  url: string | undefined;
}

const EduSchema = Yup.object().shape({
  degree: Yup.string().required("Degree is required"),
  field: Yup.string().required("Field is required"),
  description: Yup.string().required("Description is required"),
  end_year: Yup.string().required("End year is required"),
  url: Yup.string().url("Invalid URL").optional(),
});

const defaultValues: EduFormData = {
  degree: "",
  field: "",
  description: "",
  end_year: "",
  url: "",
};

// Define the types for the component's props
interface EduFormProps {
  currentEdu: Education | null;
  setCurrentEdu: Dispatch<SetStateAction<Education | null>>;
  eduFormRef: RefObject<HTMLDivElement | null>;
}

function EduForm({ currentEdu, setCurrentEdu, eduFormRef }: EduFormProps) {
  const { dataById, isLoading } = useAppSelector((state) => state.education);
  
  const updatedEduId = currentEdu
    ? (dataById as Record<string, Education>)[currentEdu._id]
      ? currentEdu._id
      : null
    : null;

  const methods = useForm({
    resolver: yupResolver(EduSchema),
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
    if (currentEdu) {
      const updatedEdu = (dataById as Record<string, Education>)[currentEdu._id];
      if (updatedEdu) {
        setValue("degree", updatedEdu.degree);
        setValue("field", updatedEdu.field);
        setValue("description", updatedEdu.description);
        setValue("url", updatedEdu.url);
        setValue("end_year", updatedEdu.end_year);
      }
    } else {
      reset();
    }
  }, [currentEdu, dataById, setValue, reset]);

  const renderDynamicFields = (fields: EduFormData) => {
    return Object.keys(fields).map((fieldName) => (
      <FTextField
        key={fieldName}
        name={fieldName as keyof EduFormData} // Type assertion for name prop
        fullWidth
        label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        sx={{
          "& fieldset": {
            borderWidth: `1px !important`,
            borderColor: alpha("#919EAB", 0.32),
          },
        }}
      />
    ));
  };

  const onSubmit = (data: any) => {
    if (updatedEduId) {
      dispatch(educationUpdate({ itemId: updatedEduId, data }));
      setCurrentEdu(null);
      reset();
    } else {
      dispatch(educationCreate(data));
      reset();
    }
  };

  const handleCancelEditing = () => {
    setCurrentEdu(null);
    reset();
  };

  return (
    <div ref={eduFormRef}>
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {renderDynamicFields(defaultValues)}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                size="small"
                loading={isSubmitting || isLoading}
              >
                {updatedEduId ? "Save Changes" : "Create"}
              </LoadingButton>
              {updatedEduId && (
                <LoadingButton
                  variant="contained"
                  color="error"
                  size="small"
                  loading={isSubmitting || isLoading}
                  onClick={handleCancelEditing}
                >
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

export default EduForm;