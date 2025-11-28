"use client"

import type { FC } from "react";
import { FormProvider, FTextField } from "@/src/components/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Alert, Container, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useAuth from "@/src/hooks/useAuth";

// 1. Define a type for the form's values for type safety.
interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

// 2. Apply the type to your default values.
const defaultValues: ForgotPasswordFormValues = {
  email: "",
};

const ForgotPasswordPage: FC = () => {
  const auth = useAuth(); // Assume useAuth() provides the necessary types.

  // 3. Pass the form values type to the useForm hook.
  const methods = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  // 4. The 'data' parameter is now automatically typed as ForgotPasswordFormValues.
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await auth.forgotPassword(data.email, () => {
        reset();
      });
    } catch (error: any) { // Type the caught error
      reset();
      // Ensure the error message is a string
      const errorMessage = error?.errors?.[0]?.msg || error?.message || "An unexpected error occurred.";
      setError("root.responseError", { type: "manual", message: errorMessage });
    }
  };

  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ minWidth: "350px" }}>
          {/* Use 'root.responseError' which is a more standard RHF practice for server errors */}
          {!!errors.root?.responseError && (
            <Alert severity="error">{errors.root.responseError.message}</Alert>
          )}
          <Alert severity="warning">Please confirm your registered email</Alert>

          <FTextField name="email" label="Email address" />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
};

export default ForgotPasswordPage;