import BrowseMentorPageClient from "./BrowseMentorPage";
import { getUserProfilesServer } from "@/src/data/user";

const initialFilter = {
  searchQuery: "",
  sortBy: "reviewDesc",
  company: "",
  position: "",
  city: "",
};

export default async function AsyncBrowseMentorsPage() {
  const defaultPage = 1;
  // const initialData = await getUserProfilesServer({
  //   filter: initialFilter,
  //   page: defaultPage,
  // });
  const initialData = await getUserProfilesServer();

  // initialData should contain { currentPageUsers, userProfilesById, total, totalPages }

  const initialMentors = initialData.currentPageUsers.map((userId) => initialData.userProfilesById[userId]);

  return <BrowseMentorPageClient initialMentors={initialMentors} initialTotal={initialData.total} initialTotalPages={initialData.totalPages} initialPage={defaultPage} />;
}
