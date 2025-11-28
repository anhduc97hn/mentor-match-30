import React from 'react';
import MentorCard from './MentorCard';
import { IMentorProfile } from '@/src/types/user';

interface Props {
  mentors: IMentorProfile[];
}

const MentorList: React.FC<Props> = ({ mentors }) => {
  return (
    <>
      {mentors.map((mentor) => (
        <MentorCard mentor={mentor} key={mentor._id} />
      ))}
    </>
  );
}

export default MentorList;