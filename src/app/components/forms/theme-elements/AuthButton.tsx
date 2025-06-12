import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import Link from 'next/link';

interface AuthButtonProps extends ButtonProps {
  href?: string;
  children: React.ReactNode;
  buttonType?: 'login' | 'signup' | 'submit';
  fullWidth?: boolean;
}

// Styled button for login (text variant)
const StyledTextButton = styled(Button)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#9CFF1F',
    backgroundColor: 'rgba(156, 255, 31, 0.05)'
  },
  '&:active': {
    transform: 'scale(0.97)',
    backgroundColor: 'rgba(156, 255, 31, 0.1)'
  }
}));

const AuthButton: React.FC<AuthButtonProps> = ({ 
  href, 
  children, 
  buttonType = 'submit',
  fullWidth = true,
  variant,
  color,
  ...rest 
}) => {
  // Login button (text variant)
  if (buttonType === 'login') {
    return (
      <StyledTextButton
        color={color || "inherit"}
        variant={variant || "text"}
        component={href ? "a" : 'button'}
        href={href || undefined}
        {...rest}
      >
        {children}
      </StyledTextButton>
    );
  }
  
  // Signup or submit button (contained variant)
  return (
    <Button
      sx={{
        borderRadius: '36px',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: '#8ce61c',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(156, 255, 31, 0.25)'
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 2px 4px rgba(156, 255, 31, 0.2)'
        }
      }}
      color={color || "primary"}
      variant={variant || "contained"}
      size="large"
      fullWidth={fullWidth}
      component={href ? "a" : 'button'}
      href={href || undefined}
      type={!href ? "submit" : undefined}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
