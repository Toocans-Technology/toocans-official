'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { EmailLoginRequest, SmsLoginRequest, PasswordLoginRequest } from '@/app/api/auth/login/types';

const AuthLogin = ({ title, subtitle, subtext }: LoginType) => {
  const router = useRouter();
  // State management
  const [countdown, setCountdown] = useState<number>(0);
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [loginMode, setLoginMode] = useState<'code' | 'password'>('code');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false); // This might need further review based on actual forgot password flow
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  // Input states
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom hooks
  const { countryCodes, selectedCountry, setSelectedCountry } = useCountryCodes();
  
  // Event handlers
  // const handleForgotPasswordClick = () => { // Commented out as its usage with the new submit is unclear
  //   setForgotPassword(true);
  // };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSendCode = () => {
    // TODO: Implement actual API call to send verification code based on email/phone
    if (countdown === 0) {
      console.log(`Sending verification code to ${loginType === 'email' ? email : selectedCountry + phoneNumber}...`);
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiError(null);
    const clientId = "24b5d2a7f4714409b4cc60bafc1dd2f6"; // Fixed client ID
    let payload: EmailLoginRequest | SmsLoginRequest | PasswordLoginRequest;

    try {
      if (loginMode === 'password') {
        const commonPasswordPayload = {
          clientId,
          grantType: 'password' as 'password', // Type assertion
          username: '', // To be filled
          password: password,
        };
        if (loginType === 'email') {
          payload = { ...commonPasswordPayload, username: email };
        } else { // phone
          payload = { ...commonPasswordPayload, username: selectedCountry + phoneNumber };
        }
      } else { // code
        if (loginType === 'email') {
          payload = {
            clientId,
            grantType: 'email' as 'email', // Type assertion
            email: email,
            emailCode: verificationCode,
          };
        } else { // phone
          payload = {
            clientId,
            grantType: 'sms' as 'sms', // Type assertion
            nationalCode: selectedCountry, // Assuming selectedCountry is like "86"
            phonenumber: phoneNumber,
            smsCode: verificationCode,
          };
        }
      }

      const response = await fetch('https://dev-api.bdy.tech/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setApiError(errorData.msg || `Login failed with status: ${response.status}`);
        console.error('Login failed:', errorData);
      }
    } catch (error) {
      console.error('Network or other error during login:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {title ? (
        <Typography fontWeight="500" variant="h3" mb={2} color="#000">
          {/* Removed forgotPassword logic from title for now, focusing on login */}
          {title}
        </Typography>
      ) : null}

      {subtext}
      <Box sx={{
        width: { xs: '100%', sm: '432px' },
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <Stack spacing={2}> {/* Added spacing to Stack for better layout */}
          <Box>
            <EmailPhoneToggle loginType={loginType} setLoginType={setLoginType} />
            {loginType === 'email' ? (
              <EmailInput
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <PhoneInput
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                countryCodes={countryCodes}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
            )}
          </Box>
          
          {/* Removed !forgotPassword condition for now to simplify */}
          {loginMode === 'code' ? (
            <VerificationCodeInput
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              countdown={countdown}
              handleSendCode={handleSendCode}
            />
          ) : (
            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
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

          {apiError && (
            <Typography color="error" variant="body2" textAlign="center">
              {apiError}
            </Typography>
          )}
        </Stack>
        
        <Box mt={3} mb={1}> {/* Adjusted margin for spacing */}
          <AuthSubmitButton
            onClick={handleSubmit}
            disabled={isLoading}
            isForgotPassword={forgotPassword} // This prop might need re-evaluation
          />
        </Box>

        <UserAgreement loginMode={loginMode} />
      </Box>
      
      {subtitle}
    </>
  );
};

export default AuthLogin;