import { Suspense } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";
import AsyncBrowseMentorsPage from "./AsyncBrowseMentorPage";

export default function BrowseMentorsPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AsyncBrowseMentorsPage />
    </Suspense>
  );
}
