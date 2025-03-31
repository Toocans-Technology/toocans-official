import React from 'react';
import { Stack, Typography, Popover } from '@mui/material';
import Link from 'next/link';

interface LoginModeSwitchProps {
  loginMode: 'code' | 'password';
  setLoginMode: (mode: 'code' | 'password') => void;
  countdown: number;
  open: boolean;
  anchorEl: HTMLElement | null;
  handlePopoverOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handlePopoverClose: () => void;
}

const LoginModeSwitch: React.FC<LoginModeSwitchProps> = ({
  loginMode,
  setLoginMode,
  countdown,
  open,
  anchorEl,
  handlePopoverOpen,
  handlePopoverClose
}) => {
  return (
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
        >
          Forgot password
        </Typography>
      }

      {countdown > 0 && 
        <Typography
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
        </Typography>
      }
      
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
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
        <Typography sx={{ px: 2, py: 1, backgroundColor: '#FFF', width: '230px', color: '#000' }}>
          Please try the following steps:
          <ul style={{ color: '#666', padding: '2px 6px', fontSize: '12px' }}>
            <li>
              Check if you are using the correct email address ab***@gm***
            </li>
            <li>
              If you are still unable to receive it, please check your spam folder.
            </li>
          </ul>
        </Typography>
      </Popover>
    </Stack>
  );
};

export default LoginModeSwitch;
