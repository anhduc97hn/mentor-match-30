import LoadingScreen from "@/src/components/LoadingScreen";
import { Suspense } from "react";
import { AsyncMentorContent } from "./AsyncMentorContent";
import './MentorPage.css';

interface MentorRouteParams {
  params: {
    mentorId: string;
  };
}

export default async function MentorPageRSC({ params }: MentorRouteParams) {
  const { mentorId } = await params;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AsyncMentorContent mentorId={mentorId} />
    </Suspense>
  );
}
