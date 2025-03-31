import React from 'react';
import { Box } from '@mui/material';

interface StepIndicatorProps {
  step: number;
  active: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, active }) => (
  <Box
    sx={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      bgcolor: active ? '#000' : '#999999',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 2,
      fontWeight: 'bold',
      fontSize: '14px'
    }}
  >
    {step}
  </Box>
);

export default StepIndicator;
