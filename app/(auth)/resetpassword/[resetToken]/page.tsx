"use client"

import React, { useState } from 'react';
import { FormProvider, FTextField } from "@/src/components/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Alert, Container, IconButton, InputAdornment, Stack } from '@mui/material';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
// import { useNavigate, useParams } from "react-router-dom";
import { useRouter } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';

// Define the validation schema for the form
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

// Infer the TypeScript type from the Yup schema for form data
type ResetPasswordFormInputs = Yup.InferType<typeof ResetPasswordSchema>;

// Define a type for the URL parameters from React Router
type ResetRouteParams = {
  resetToken: string;
};

// Strongly type the default values
const defaultValues: ResetPasswordFormInputs = {
  password: "",
  passwordConfirmation: ""
};

// Define the component as a React Functional Component (React.FC)
const ResetPasswordPage: React.FC<ResetRouteParams> = ({ resetToken}) => {
  // const navigate = useNavigate();
  const router = useRouter();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false);

  // Type the params from the URL
  // const { resetToken } = useParams<ResetRouteParams>();

  // Provide the form input type to useForm for type-safety
  const methods = useForm<ResetPasswordFormInputs>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  // Type the 'data' parameter for the submit handler
  const onSubmit = async (data: ResetPasswordFormInputs) => {
    const { password } = data;

    try {
      if (!resetToken) {
        throw new Error("Reset token is missing.");
      }
      await auth.resetPassword({ newPassword: password, resetToken }, () => {
       // navigate("/login", { replace: true });
       router.replace("/login")
      });
    } catch (error: any) { // Using 'any' as the specific error shape is unknown
      reset();
      setError("root.responseError", {
        type: "manual",
        message: error.message || "Failed to reset password",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ minWidth: "350px" }}>
        {!!errors.root?.responseError && (
            <Alert severity="error">{errors.root.responseError.message}</Alert>
          )}
          <Alert severity="success">
           Please enter your new password.
          </Alert>

          <FTextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
            <FTextField
            name="passwordConfirmation"
            label="Password Confirmation"
            type={showPasswordConfirmation ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }
                    edge="end"
                  >
                    {showPasswordConfirmation ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update Password
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}

export default ResetPasswordPage;