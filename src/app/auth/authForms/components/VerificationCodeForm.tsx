import React from 'react';
import { Box, Typography } from '@mui/material';
import AuthTwoSteps from '../AuthTwoSteps';
import { NotificationState } from '../../utils/verificationCodeUtils';

interface VerificationCodeFormProps {
  loginType: 'email' | 'phone';
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  email?: string;
  phoneNumber?: string;
  selectedCountry?: string;
  onNotification?: (notification: NotificationState | null) => void;
}

const VerificationCodeForm: React.FC<VerificationCodeFormProps> = ({
  loginType,
  countdown,
  setCountdown,
  email,
  phoneNumber,
  selectedCountry,
  onNotification
}) => {
  // Helper function to mask email according to requirements
  const maskEmail = (email: string) => {
    if (!email || !email.includes('@')) return 'ab***@gm***';
    
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? `${username.substring(0, 2)}***` 
      : `${username}***`;
    
    const maskedDomain = domain.length > 2
      ? `${domain.substring(0, 2)}***`
      : `${domain}***`;
    
    return `${maskedUsername}@${maskedDomain}`;
  };

  // Helper function to mask phone number according to requirements
  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 5) return '12***123';
    
    return `${phone.substring(0, 2)}***${phone.substring(phone.length - 3)}`;
  };

  return (
    <Box p={4}>
      <Typography variant="subtitle1" color="#666" mt={2} mb={1}>
        We sent a verification code to your {loginType === 'email' ? 'email' : 'mobile'}. 
        Enter the code from the {loginType === 'email' ? 'email' : 'mobile'} in the field below.
      </Typography>
      {/* Example of masked contact info - in a real app, you would use actual user data */}
      {/* <Typography variant="subtitle1" fontWeight="700" mb={1}>
        {loginType === 'email' ? maskEmail('user@example.com') : maskPhone('1234567890')}
      </Typography> */}
      <AuthTwoSteps
        countdown={countdown}
        setCountdown={setCountdown}
        email={email}
        phoneNumber={phoneNumber}
        loginType={loginType}
        selectedCountry={selectedCountry}
        onNotification={onNotification}
      />
    </Box>
  );
};

export default VerificationCodeForm;
