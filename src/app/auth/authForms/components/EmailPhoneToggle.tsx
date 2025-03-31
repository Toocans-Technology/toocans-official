import React from 'react';
import { Box } from '@mui/material';

interface EmailPhoneToggleProps {
  loginType: 'email' | 'phone';
  setLoginType: (type: 'email' | 'phone') => void;
}

const EmailPhoneToggle: React.FC<EmailPhoneToggleProps> = ({ loginType, setLoginType }) => {
  return (
    <Box display="flex" gap={2} mb={1}>
      <Box
        onClick={() => setLoginType('email')}
        sx={{
          cursor: 'pointer',
          color: loginType === 'email' ? '#222' : '#666',
          fontWeight: 500,
          fontSize: '14px'
        }}
      >
        Email
      </Box>
      <Box
        onClick={() => setLoginType('phone')}
        sx={{
          cursor: 'pointer',
          color: loginType === 'phone' ? '#222' : '#666',
          fontWeight: 500,
          fontSize: '14px'
        }}
      >
        Phone
      </Box>
    </Box>
  );
};

export default EmailPhoneToggle;
