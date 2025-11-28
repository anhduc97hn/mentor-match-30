'use client';

import React from 'react';
import SessionListWrapper from './SessionListWrapper'; 
import { UserProfile } from '@/src/types/user';
function SessionUpcoming(userProfile: UserProfile) {
  return (
    <SessionListWrapper
      userProfile={userProfile}
      status="accepted"
      prevStatus="accepted"
      enableStatusCheck={true} 
    />
  );
}

export default SessionUpcoming;
