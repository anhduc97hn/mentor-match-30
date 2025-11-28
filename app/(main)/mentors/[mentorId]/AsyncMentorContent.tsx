import NotFoundPage from "@/app/not-found";
import { getMentorProfileServer } from "@/src/data/user";
import { MentorHeader } from "./MentorHeader";
import MentorPageClient from "./MentorPage"
import { Container } from "@mui/material";


export async function AsyncMentorContent({ mentorId }: { mentorId: string }) {
  const mentorProfile = await getMentorProfileServer(mentorId);

  // Handle 404 inside the async component
  if (!mentorProfile) return <NotFoundPage />;

  return (
     <Container 
      className="mentor-page" 
      maxWidth={false} 
      disableGutters 
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <MentorHeader profile={mentorProfile} />
      <MentorPageClient mentorProfile={mentorProfile} mentorId={mentorId} />
    </Container>
  );
}