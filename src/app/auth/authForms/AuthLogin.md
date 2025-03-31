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
            {loginType === 'email' ? (
              <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                placeholder="Enter Email"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiOutlinedInput-root': {
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    color: '#000'
                  }
                }}
              />
            ) : (
              <Box sx={{
                display: 'flex',
                gap: 1,
                '& .MuiOutlinedInput-root': {
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  border: 'none'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}>
                <Autocomplete
                  value={countryCodes.find(c => c.nationalCode === selectedCountry) || undefined}
                  onChange={(_, newValue) => {
                    setSelectedCountry(newValue?.nationalCode || '');
                  }}
                  options={countryCodes}
                  getOptionLabel={(option) => `+${option.nationalCode}`}
                  ListboxProps={{
                    style: {
                      backgroundColor: '#fff',
                      color: '#000',
                      padding: '8px 0'
                    }
                  }}
                  PaperComponent={({ children }) => (
                    <Paper sx={{
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      marginTop: '4px'
                    }}>{children}</Paper>
                  )}
                  renderOption={(props, option) => (
                    <MenuItem {...props} key={option.id} sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#000',
                      backgroundColor: '#fff',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#f5f5f5',
                        color: '#000',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          color: '#000'
                        },
                      },

                    }}>
                      <img
                        src={`https://flagcdn.com/w20/${option.domainShortName?.toLowerCase()}.png`}
                        alt={option.countryEnName || ''}
                        style={{
                          width: '20px',
                          height: '15px',
                          objectFit: 'cover',
                          borderRadius: '2px',

                        }}
                        loading="lazy"
                      />
                      +{option.nationalCode}
                    </MenuItem>
                  )}
                  renderInput={(params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      {selectedCountry && countryCodes.find(c => c.nationalCode === selectedCountry) && (
                        <img
                          src={`https://flagcdn.com/w20/${countryCodes.find(c => c.nationalCode === selectedCountry)?.domainShortName?.toLowerCase()}.png`}
                          alt={countryCodes.find(c => c.nationalCode === selectedCountry)?.countryEnName || ''}
                          style={{
                            width: '20px',
                            height: '15px',
                            objectFit: 'cover',
                            borderRadius: '2px',
                            position: 'absolute',
                            left: '8px',
                            zIndex: 1
                          }}
                          loading="lazy"
                        />
                      )}
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            ...params.InputProps?.sx,
                            color: '#000',
                            paddingLeft: selectedCountry ? '32px !important' : '14px',
                            width: '130px',
                            height: '44px'
                          }
                        }}
                      />
                    </Box>
                  )}
                  disableClearable
                  size="small"
                />
                <CustomTextField
                  id="phone"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Phone Number"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiOutlinedInput-root': {
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      color: '#000',
                      height: '44px',
                      '& input': {
                        height: '44px',
                        padding: '0 14px'
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Box>
          {
            !forgotPassword && (
            loginMode === 'code' ?
            <Box>
            <CustomFormLabel htmlFor="code" color="#222" fontWeight="400">Verification Code</CustomFormLabel>
            <CustomTextField
              id="code"
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      sx={{
                        minWidth: '80px',
                        height: '36px',
                        bgcolor: 'transparent',
                        color: '#3C7BF4',
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: 'transparent',
                          boxShadow: 'none',
                          color: '#8ab0f8',
                        }
                      }}
                    >
                      {countdown > 0 ? <span style={{ color: '#3C7BF4' }}>{countdown}s</span> : 'Send'}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiOutlinedInput-root': {
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  color: '#000'
                }
              }}
            />
          </Box>
            :
            <Box>
            <CustomFormLabel htmlFor="password" color="#222" fontWeight="400">Password</CustomFormLabel>
            <CustomTextField
              id="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      component="span"
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        cursor: 'pointer',
                        color: '#666',
                        display: 'flex',
                        '&:hover': {
                          color: '#333'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon  /> : <VisibilityOutlinedIcon  />}
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': {
                background: '#f5f5f5',
                borderRadius: '8px',
                color: '#000',
                height: '44px',
                '& input': {
                  height: '44px',
                  padding: '0 14px'
                }
              }
            }}
            />
          </Box>
          )}

          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
            mb={4}
          >
            <Typography
              component={Link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // setForgotPassword(false);
                setLoginMode(loginMode === 'code' ? 'password' : 'code');
              }}
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#3C7BF4",
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {countdown > 0 ? "" : (loginMode === 'code' ? "Switch to password login" : "Switch to code login")}
            </Typography>

            {loginMode === 'password' &&
            <Typography
              component={Link}
              href="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#3C7BF4",
                fontSize: '12px',
                cursor: 'pointer'

              }}
              // onClick={handleForgotPasswordClick}
            >

              Forgot password
            </Typography>}

            {countdown > 0 && <Typography
              component={Link}
              href="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#A9A9A9",
                fontSize: '12px'
              }}
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >

              {countdown > 0 ? "Not able to receive verification code?" : ""}
              {loginMode === 'code' ? "Forgot password" : ""}
            </Typography>}
            <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none'}}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ px: 2, py: 1, backgroundColor: '#FFF', width: '230px', color: '#000'    }}>
        Please try the following steps:
        <ul style={{ color: '#666', padding:'2px 6px', fontSize: '12px' }}>
          <li>
          Check if you are using the correct email address abc***@gmail.com
          </li>
          <li>
          If you are still unable to receive it, please check your spam folder.
          </li>
        </ul>

        </Typography>
      </Popover>

          </Stack>
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
