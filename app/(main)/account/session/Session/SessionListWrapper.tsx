'use client';

import React, { useEffect, useState } from 'react';
import { getSessions, updateSessionStatus } from '@/src/slices/sessionSlice';
import SessionList from './SessionList';
import { UserProfile } from '@/src/types/user';
import { useAppDispatch, useAppSelector } from '@/src/appService/hooks';
import { Session } from '@/src/types/session';

// Define props for the wrapper component
interface SessionListWrapperProps {
  userProfile: UserProfile;
  status: string; // The status filter (e.g., "pending", "completed")
  prevStatus?: string; // Optional prop passed to ActionButton via SessionList
  enableStatusCheck?: boolean;
}

export default function SessionListWrapper({
  userProfile,
  status,
  prevStatus,
  enableStatusCheck = false, // Set default to false
}: SessionListWrapperProps) {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();

  const { currentPageSessions, sessionsById, isLoading, error, total, totalPages } = useAppSelector(state => state.session);

  const sessions = currentPageSessions.map(sessionId => sessionsById[sessionId]);
  // Logic to check and update session status (moved from SessionUpcoming)
  const checkAndUpdateSessionStatus = (session: Session) => {
    const currentTime = new Date();
    const sessionEndTime = new Date(session.endDateTime);

    if (currentTime >= sessionEndTime) {
      dispatch(updateSessionStatus({ sessionId: session._id, status: 'completed', prevStatus: 'accepted' }));
    }
  };
  // Primary data fetching effect, dependent on status and page
  useEffect(() => {
    // Only fetch data when 'page' or 'status' changes
    dispatch(getSessions({ status, page }));
  }, [dispatch, status, page]);

  // NEW: Conditional Side Effect for status checking
  useEffect(() => {
    if (enableStatusCheck) {
      sessions.forEach(session => {
        checkAndUpdateSessionStatus(session);
      });
    }
    // Dependency array includes sessions, dispatch, and the flag
  }, [sessions, dispatch, enableStatusCheck]);

  return (
    <SessionList
      isLoading={isLoading}
      error={error}
      sessions={sessions}
      userProfile={userProfile}
      total={total}
      totalPages={totalPages}
      setPage={setPage}
      prevStatus={prevStatus || status} // Use status as default prevStatus if not provided
    />
  );
}
