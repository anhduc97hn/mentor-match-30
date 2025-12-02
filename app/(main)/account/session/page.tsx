'use client';

import React from 'react';
import DashboardTabs from '@/src/components/DashboardTabs';
import SessionArchived from './Session/SessionArchived';
import SessionCanceled from './Session/SessionCanceled';
import SessionRequests from './Session/SessionRequests';
import SessionReviewed from './Session/SessionReviewed';
import SessionUpcoming from './Session/SessionUpcoming';
import SessionDeclined from './Session/SessionDeclined';
import { UserProfile } from '@/src/types/user';
import ProtectedPage from '@/src/components/withAuth';
import useAuth from '@/src/hooks/useAuth';

// interface Tab {
//   value: string;
//   component: (userProfile: UserProfile) => ReactElement;
// }

const title = 'My Session';
const ACCOUNT_TABS = [
  {
    value: 'requests',
    component: (props: any) => <SessionRequests {...props} />,
  },
  {
    value: 'upcoming',
    component: (props: any) => <SessionUpcoming {...props} />,
  },
  {
    value: 'archived',
    component: (props: any) => <SessionArchived {...props} />,
  },
  {
    value: 'reviewed',
    component: (props: any) => <SessionReviewed {...props} />,
  },
  {
    value: 'cancelled',
    component: (props: any) => <SessionCanceled {...props} />,
  },
  {
    value: 'declined',
    component: (props: any) => <SessionDeclined {...props} />,
  },
];

// interface UserSessionProps {
//   userProfile;
//   isMentor: boolean;
// }

function UserSession() {
  const auth = useAuth();
  const isMentor = auth?.userProfile?.isMentor;
  const userProfile = auth?.userProfile 

  const filteredTabs = isMentor ? ACCOUNT_TABS.filter(tab => tab.value !== 'archived') : ACCOUNT_TABS;
  const tabsWithProps = filteredTabs.map(tab => ({
    ...tab,
    component: <tab.component {...userProfile} />, // ?
  }));


  return (
      <DashboardTabs tabs={tabsWithProps} title={title} defaultTab="requests" />
  );
}

export default UserSession;
