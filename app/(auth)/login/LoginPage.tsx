"use client";

import React, { useState } from "react";
import { FCheckbox, FormProvider, FTextField } from "@/src/components/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Alert, Box, Container, Divider, IconButton, InputAdornment, Link, Stack, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import useAuth from "@/src/hooks/useAuth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  remember: Yup.boolean().required(),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const auth = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const from = searchParams?.get("redirect") || "/";
  const onSubmit = async (data: any) => {
    const { email, password } = data;

    try {
      await auth.login({ email, password }, () => {
        router.push(from);
      });
    } catch (error: any) {
      reset();
      setError("root.responseError", {
        type: "manual",
        message: error.message || "An unexpected error occurred",
      });
    }
  };

  const handleGoogleResponse = async (res: CredentialResponse) => {
    const { credential } = res;
    if (!credential) {
      console.log("Google login failed: no credential returned.");
      return;
    }
    try {
      await auth.loginWithGoogle(credential, () => {
        router.push(from);
      });
    } catch (error) {
      console.log("handleGoogleResponse", error);
    }
  };

  const handleGoogleClick = () => {
    router.prefetch(from)
  }

  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ minWidth: "350px" }}>
          {!!errors.root?.responseError && <Alert severity="error">{errors.root.responseError.message}</Alert>}
          <Alert severity="info">
            Don't have an account?{" "}
            <Link variant="subtitle2" component={NextLink} href="/register">
              Get started
            </Link>
          </Alert>

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
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FCheckbox name="remember" label="Remember me" />
            <Link component={NextLink} variant="subtitle2" href="/forgetpassword">
              Forgot password?
            </Link>
          </Stack>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Login
          </LoadingButton>
        </Stack>
      </FormProvider>
      <Divider sx={{ borderStyle: "dashed", borderColor: "primary.main", m: 2 }} variant="fullWidth" />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        gap={2}
      >
        <Typography variant="subtitle2">Or sign in with Google </Typography>
        <GoogleLogin
          onSuccess={handleGoogleResponse}
          onError={() => {
            console.log("Login Failed");
          }}
          shape="pill"
          click_listener={handleGoogleClick}
        />
      </Box>
    </Container>
  );
};

export default LoginPage;
