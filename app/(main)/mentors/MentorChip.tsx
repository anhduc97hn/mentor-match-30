import { Chip, Stack } from '@mui/material';
import React from 'react';

interface Props {
  labels: (string | null | undefined)[] | null | undefined;
}

const MentorChip: React.FC<Props> = ({ labels }) => {
  const validLabels = labels?.filter((label): label is string => !!label) || [];
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      {validLabels.map((label, index) => (
        <Chip 
          label={label} 
          variant="outlined" 
          size="small" 
          sx={{ m: 0.5 }} 
          key={`${label}-${index}`} // Use a more stable key if possible
        />
      ))}
    </Stack>
  );
}

export default MentorChip;