import { Suspense } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";
import LoginPage from "./LoginPage";

export default async function page() {
  <Suspense fallback={<LoadingScreen />}>
    <LoginPage />
  </Suspense>;
}
