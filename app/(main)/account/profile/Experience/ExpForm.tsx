import React, { useEffect, Dispatch, SetStateAction, RefObject } from "react";
import { Box, Card, alpha, Stack } from "@mui/material";
import { FormProvider, FTextField } from "@/src/components/form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { experienceCreate, experienceUpdate } from "@/src/slices/resourceSlice";
import { LoadingButton } from "@mui/lab";
// import { RootState } from "../../../store"; // Assuming you have a RootState type for your Redux store
import { Experience, Position } from "@/src/types/user";
import { useAppDispatch, useAppSelector } from "@/src/appService/hooks";

// Define the shape of the form data
interface ExpFormData {
  company: string;
  industry: string;
  location: string;
  url: string;
  position: Position;
}

const ExpSchema = Yup.object().shape({
  company: Yup.string().required("Company is required"),
  industry: Yup.string().required("Industry is required"),
  location: Yup.string().required("Location is required"),
  url: Yup.string().url("Invalid URL").optional(),
  position: Yup.object().shape({
    title: Yup.string().required("Position title is required"),
    description: Yup.string().required("Position description is required"),
    start_date: Yup.string().required("Start date is required"),
    end_date: Yup.string().required("End date is required"),
  }),
});

const defaultValues: ExpFormData = {
  company: "",
  industry: "",
  location: "",
  url: "",
  position: {
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  },
};

// Define the types for the component's props
interface ExpFormProps {
  currentExp: Experience | null;
  setCurrentExp: Dispatch<SetStateAction<Experience | null>>;
  expFormRef: RefObject<HTMLDivElement | null>;
}

function ExpForm({ currentExp, setCurrentExp, expFormRef }: ExpFormProps) {
  const { dataById, isLoading } = useAppSelector((state) => state.experience);
  
  const updatedExpId = currentExp
    ? (dataById as Record<string, Experience>)[currentExp._id]
      ? currentExp._id
      : null
    : null;

  const methods = useForm({
    resolver: yupResolver(ExpSchema),
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
    if (currentExp) {
      const updatedExp = (dataById as Record<string, Experience>)[currentExp._id];
      if (updatedExp) {
        setValue("company", updatedExp.company);
        setValue("industry", updatedExp.industry);
        setValue("location", updatedExp.location);
        setValue("url", updatedExp.url);
        setValue("position.title", updatedExp.position.title);
        setValue("position.description", updatedExp.position.description);
        setValue("position.start_date", updatedExp.position.start_date);
        setValue("position.end_date", updatedExp.position.end_date);
      }
    } else {
      reset();
    }
  }, [currentExp, dataById, setValue, reset]);

  const renderDynamicFields = (fields: object, prefix = "") => {
    return Object.keys(fields).map((fieldName) => {
      if (fieldName === "position") return null;

      const label =
        prefix + fieldName !== "position"
          ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          : "";

      return (
        <FTextField
          key={prefix + fieldName}
          name={`${prefix}${fieldName}`}
          fullWidth
          label={label}
          sx={{
            "& fieldset": {
              borderWidth: `1px !important`,
              borderColor: alpha("#919EAB", 0.32),
            },
          }}
        />
      );
    });
  };

  const onSubmit = (data: any) => {
    if (updatedExpId) {
      dispatch(experienceUpdate({ itemId: updatedExpId, data }))
        setCurrentExp(null);
        reset();
     ;
    } else {
      dispatch(experienceCreate(data))
      reset();
    }
  };

  const handleCancelEditing = () => {
    setCurrentExp(null);
    reset();
  };

  return (
    <div ref={expFormRef}>
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {renderDynamicFields(defaultValues)}
            {renderDynamicFields(defaultValues.position, "position.")}
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
                {updatedExpId ? "Save Changes" : "Create"}
              </LoadingButton>
              {updatedExpId && (
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

export default ExpForm;