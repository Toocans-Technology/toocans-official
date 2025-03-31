'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack } from "@mui/material";
import { LoginType } from './types/auth';
import EmailPhoneToggle from './components/EmailPhoneToggle';
import AuthSubmitButton from './components/AuthSubmitButton';
import UserAgreement from './components/UserAgreement';
import EmailInput from './components/EmailInput';
import PhoneInput from './components/PhoneInput';
import VerificationCodeInput from './components/VerificationCodeInput';
import PasswordInput from './components/PasswordInput';
import LoginModeSwitch from './components/LoginModeSwitch';
import { useCountryCodes } from '../authForms/hooks/useCountryCodes';

const AuthLogin = ({ title, subtitle, subtext }: LoginType) => {
  // State management
  const [countdown, setCountdown] = useState<number>(0);
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [loginMode, setLoginMode] = useState<'code' | 'password'>('code');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  
  // Custom hooks
  const { countryCodes, selectedCountry, setSelectedCountry } = useCountryCodes();
  
  // Event handlers
  const handleForgotPasswordClick = () => {
    setForgotPassword(true);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSendCode = () => {
    if (countdown === 0) {
      // Here you would add API call to send verification code
      console.log('Sending verification code...');

      // Start countdown
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {title ? (
        <Typography fontWeight="500" variant="h3" mb={2} color="#000">
          {forgotPassword ? 'Forgot Password' : title}
        </Typography>
      ) : null}

      {subtext}
      <Box sx={{
        width: { xs: '100%', sm: '432px' },
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <Stack>
          <Box>
            <EmailPhoneToggle loginType={loginType} setLoginType={setLoginType} />
            {loginType === 'email' ? (
              <EmailInput />
            ) : (
              <PhoneInput
                countryCodes={countryCodes}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
            )}
          </Box>
          
          {!forgotPassword && (
            loginMode === 'code' ? (
              <VerificationCodeInput
                countdown={countdown}
                handleSendCode={handleSendCode}
              />
            ) : (
              <PasswordInput
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )
          )}

          <LoginModeSwitch
            loginMode={loginMode}
            setLoginMode={setLoginMode}
            countdown={countdown}
            open={open}
            anchorEl={anchorEl}
            handlePopoverOpen={handlePopoverOpen}
            handlePopoverClose={handlePopoverClose}
          />
        </Stack>
        
        <Box mb={1}>
          <AuthSubmitButton isForgotPassword={forgotPassword} />
        </Box>

        <UserAgreement loginMode={loginMode} />
      </Box>
      
      {subtitle}
    </>
  );
};

export default AuthLogin;