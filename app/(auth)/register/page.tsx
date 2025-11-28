"use client";

import { Alert, Container, IconButton, InputAdornment, Link as MUILink, Stack } from "@mui/material";
import React, { useState } from "react";
import { FCheckbox, FTextField, FormProvider } from "@/src/components/form";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useAuth from "@/src/hooks/useAuth";

// Define the validation schema for the registration form
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  isMentor: Yup.boolean().required(),
});

// Infer the TypeScript type from the Yup schema for type safety
type RegisterFormInputs = Yup.InferType<typeof RegisterSchema>;

// Define default values with the created type
const defaultValues: RegisterFormInputs = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  isMentor: false,
};

// Define the component as a React Functional Component (React.FC)
const RegisterPage: React.FC = () => {
  // const navigate = useNavigate();
  const router = useRouter();
  const auth = useAuth(); // Consider defining a type for the return value of useAuth
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);

  // Provide the form input type to useForm for type-safe methods and state
  const methods = useForm<RegisterFormInputs>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  // Type the 'data' parameter for the form submission handler
  const onSubmit = async (data: RegisterFormInputs) => {
    const { name, email, password, isMentor } = data;
    try {
      await auth.register({ name, email, password, isMentor }, () => {
        // navigate("/", { replace: true });
        router.replace("/");
      });
    } catch (error: any) {
      // Using 'any' as the specific error shape is unknown
      reset();
      setError("root.responseError", {
        type: "manual",
        message: error.message || "An unexpected error occurred during registration",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.root?.responseError && <Alert severity="error">{errors.root.responseError.message}</Alert>}
          <Alert severity="info">
            Already have an account?{" "}
            <MUILink variant="subtitle2" component={Link} href="/login">
              Sign in
            </MUILink>
          </Alert>

          <FTextField name="name" label="Full name" />
          <FTextField name="email" label="Email address" />
          <FTextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                  <IconButton onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} edge="end">
                    {showPasswordConfirmation ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FCheckbox name="isMentor" label="Register as a mentor" />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
};

export default RegisterPage;
