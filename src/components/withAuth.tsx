"use client"; // This component must be a Client Component

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Use the Next.js router
import useAuth from "@/src/hooks/useAuth" // Your existing auth hook
import LoadingScreen from "./LoadingScreen";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathName = usePathname() as string;

  useEffect(() => {
    // Wait until the auth state is initialized.
    if (isInitialized && !isAuthenticated) {
      // If not authenticated, redirect to the login page.
      // router.push("/login");
      router.push(`/login?redirect=${encodeURIComponent(pathName)}`)
    }
  }, [isInitialized, isAuthenticated, router]);

  // While checking, show a loading screen.
  if (!isInitialized || !isAuthenticated) {
    return <LoadingScreen />;
  }

  // If authenticated, render the page content.
  return <>{children}</>;
}