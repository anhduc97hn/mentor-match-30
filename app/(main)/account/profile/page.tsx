'use client'

import React from "react";
import DashboardTabs from "@/src/components/DashboardTabs";
import AccountGeneral from "./AccountGeneral";
import AccountEducation from "./Education/AccountEducation";
import AccountExperiences from "./Experience/AccountExperiences";
import AccountCertifications from "./Certification/AccountCertifications";
import ProtectedPage from "@/src/components/withAuth";
import useAuth from "@/src/hooks/useAuth";

// --- Component ---

const title = "My Profile";

// Type the ACCOUNT_TABS array
const ACCOUNT_TABS = [
  {
    value: "General",
    component: <AccountGeneral />,
  },
  {
    value: "Education",
    component: <AccountEducation />,
  },
  {
    value: "Experiences",
    component: <AccountExperiences />,
  },
  {
    value: "Certifications",
    component: <AccountCertifications />,
  },
];

const UserProfile: React.FC = () => {
   const auth = useAuth();
  const isMentor = auth?.userProfile?.isMentor || null;
  const userProfile = auth?.userProfile || null; 
  return isMentor ? (
    <ProtectedPage>
      <DashboardTabs
        tabs={ACCOUNT_TABS}
        title={title}
        defaultTab="General"
      />
    </ProtectedPage>
  ) : (
    <ProtectedPage>
      <DashboardTabs
        tabs={[ACCOUNT_TABS[0]]} // Only show the "General" tab for non-mentors
        title={title}
        defaultTab="General"
      />
    </ProtectedPage>
  );
};

export default UserProfile;