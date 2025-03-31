'use client';

import React, { useState, useEffect } from 'react';
import {
Box,
Typography,
FormGroup,
FormControlLabel,
Button,
Stack,
Divider,
InputAdornment,
MenuItem,
Autocomplete,
TextField,
Popover,
Paper
} from "@mui/material";
import Link from "next/link";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import AuthSocialButtons from "./AuthSocialButtons";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EmailPhoneToggle from './EmailPhoneToggle';
import EmailInput from './EmailInput';
import PhoneInput from './PhoneInput';
import VerificationCodeInput from './VerificationCodeInput';
import PasswordInput from './PasswordInput';
import LoginModeSwitch from './LoginModeSwitch';

interface Country {
countryEnName?: string;
countryName?: string;
created?: number;
customOrder?: string;
domainShortName?: string;
id?: number;
nationalCode?: string;
status?: number;
}

interface Response {
code?: number;
data?: Country[];
msg?: string;
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
const [countdown, setCountdown] = useState<number>(0);
const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
const [loginMode, setLoginMode] = useState<'code' | 'password'>('code');
const [showPassword, setShowPassword] = useState(false);
const [countryCodes, setCountryCodes] = useState<Country[]>([]);
const [selectedCountry, setSelectedCountry] = useState<string>('');
const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
const [forgotPassword, setForgotPassword] = useState<boolean>(false);

const handleForgotPasswordClick = () =>{
setForgotPassword(true);
}

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

// Log state changes
useEffect(() => {
console.log('countryCodes state updated:', countryCodes);
}, [countryCodes]);

useEffect(() => {
console.log('selectedCountry state updated:', selectedCountry);
}, [selectedCountry]);

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
          {
            !forgotPassword && (
              loginMode === 'code' ?
                <VerificationCodeInput
                  countdown={countdown}
                  handleSendCode={handleSendCode}
                />
              :
                <PasswordInput
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
            )
          }

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
          {
            forgotPassword ?
            <Button
            sx={{
              borderRadius: '36px',
              '&:hover': {
                bgcolor: '#8ce61c'
              }
            }}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="/"
            type="submit"
          >
            Next
          </Button>
            :
            <Button
            sx={{
              borderRadius: '36px',
              '&:hover': {
                bgcolor: '#8ce61c'
              }
            }}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="/"
            type="submit"
          >
            Sign In
          </Button>}
        </Box>

        <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label=""

              />
            </FormGroup>

            <Typography sx={{
                textDecoration: "none",
                color: "#666",
                fontSize: '12px'
              }}>
        I have read and agreed to the
        <Typography
              component={Link}
              href="/auth/auth1/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#8ab0f8",
                fontSize: '12px'
              }}
            > Toocans User Agreement  </Typography>
            and
            <Typography
              component={Link}
              href="/auth/auth1/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#8ab0f8",
                fontSize: '12px'
              }}
            > Privacy policy </Typography>
            {loginMode === 'code' && <>Unregistered users will be automatically
            registered directly”</>}

        </Typography>
          </Stack>


      </Box>
      {subtitle}
    </>

);
};

export default AuthLogin;
