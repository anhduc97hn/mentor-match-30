'use client';

import React, { useEffect, useRef, useState } from 'react';
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

  // Track which sessions have already been dispatched to prevent re-dispatching on re-renders
  const dispatchedSessionsRef = useRef<Set<string>>(new Set());

  // Primary data fetching effect, dependent on status and page
  useEffect(() => {
    // Only fetch data when 'page' or 'status' changes
    dispatch(getSessions({ status, page }));
  }, [dispatch, status, page]);

  // Conditional side effect for status checking
  useEffect(() => {
    if (!enableStatusCheck) return;

    const currentTime = new Date();
    sessions.forEach(session => {
      if (dispatchedSessionsRef.current.has(session._id)) return;

      const sessionEndTime = new Date(session.endDateTime);
      if (currentTime >= sessionEndTime) {
        dispatchedSessionsRef.current.add(session._id);
        dispatch(updateSessionStatus({ sessionId: session._id, status: 'completed', prevStatus: 'accepted' }));
      }
    });
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
