import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Stack
} from "@mui/material";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import { Country, Response } from './types/auth';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import VerificationCodeForm from './components/VerificationCodeForm';

const AuthForgotPassword = ({ title, subtitle, subtext }: loginType) => {
  const [countdown, setCountdown] = useState<number>(0);
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [loginMode, setLoginMode] = useState<'code' | 'password'>('code');
  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const handleNext = () => {
    setForgotPassword(true);
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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch('https://dev-api.bdy.tech/baseConfig/allSupportCountry', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData: Response = await response.json();
        console.log('API Response:', responseData);
        
        if (responseData.data && Array.isArray(responseData.data)) {
          const activeCountries = responseData.data.filter(country => country.status === 1);
          console.log('Active Countries:', activeCountries);
          
          setCountryCodes(activeCountries);
          
          if (activeCountries.length > 0) {
            setSelectedCountry(activeCountries[0].nationalCode || '');
          }
        } else {
          console.error('Invalid data format:', responseData);
        }
      } catch (error) {
        console.error('Error fetching country codes:', error);
      }
    };
    
    fetchCountryCodes();
  }, []);
  
  // Log state changes for debugging
  useEffect(() => {
    console.log('countryCodes state updated:', countryCodes);
  }, [countryCodes]);
  
  useEffect(() => {
    console.log('selectedCountry state updated:', selectedCountry);
  }, [selectedCountry]);

  return (
    <>
      {title ? (
        <Typography fontWeight="500" variant="h3" mb={2} color="#000">
          {forgotPassword ? 'Verification Code' : title}
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
          {forgotPassword ? (
            <VerificationCodeForm
              loginType={loginType}
              countdown={countdown}
              setCountdown={setCountdown}
            />
          ) : (
            <ForgotPasswordForm
              loginType={loginType}
              setLoginType={setLoginType}
              countryCodes={countryCodes}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countdown={countdown}
              open={open}
              anchorEl={anchorEl}
              handlePopoverOpen={handlePopoverOpen}
              handlePopoverClose={handlePopoverClose}
              handleNext={handleNext}
            />
          )}
        </Stack>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthForgotPassword;
