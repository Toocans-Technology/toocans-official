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
  color: theme.palette.text.primary
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
        component={href ? Link : 'button'}
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
        '&:hover': {
          bgcolor: '#8ce61c'
        }
      }}
      color={color || "primary"}
      variant={variant || "contained"}
      size="large"
      fullWidth={fullWidth}
      component={href ? Link : 'button'}
      href={href || undefined}
      type={!href ? "submit" : undefined}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
