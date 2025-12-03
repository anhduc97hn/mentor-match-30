
import SessionRequestForm from "./SessionRequestForm";
import NotFoundPage from "@/app/not-found";
import { getMentorProfileServer } from "@/src/data/user";

export default async function SessionPage({ params }: {params: Promise<{ mentorId: string }>}) {
  const { mentorId } = await params;
  const mentorData = await getMentorProfileServer(mentorId);

  if (!mentorData) {
    return <NotFoundPage />
  }

  return (
      <SessionRequestForm mentorId={mentorId} mentor={mentorData} />
  );
}