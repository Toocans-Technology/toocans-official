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
  // Common props for the button
  const baseProps = {
    color: color || (buttonType === 'login' ? "inherit" : "primary"),
    variant: variant || (buttonType === 'login' ? "text" : "contained"),
    ...rest,
  };

  // Add conditional props only if they have valid values
  const buttonProps: ButtonProps = { ...baseProps };
  
  if (buttonType !== 'login') {
    buttonProps.fullWidth = fullWidth;
    buttonProps.size = "large";
  }

  // Login button (text variant)
  if (buttonType === 'login') {
    if (href && href.startsWith('/')) {
      return (
        <Link href={href} passHref legacyBehavior>
          <StyledTextButton {...buttonProps}>
            {children}
          </StyledTextButton>
        </Link>
      );
    } else if (href) {
      return (
        <StyledTextButton component="a" href={href} {...buttonProps}>
          {children}
        </StyledTextButton>
      );
    }
    return (
      <StyledTextButton {...buttonProps} type={rest.type || "button"}> {/* Default to type="button" if no href */}
        {children}
      </StyledTextButton>
    );
  }
  
  // Signup or submit button (contained variant)
  const commonMuiButtonProps = {
    sx: {
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
      },
      '&:disabled': {
        bgcolor: '#e0e0e0',
        color: '#666666',
        opacity: 0.8,
        cursor: 'not-allowed'
      }
    },
    ...buttonProps // Includes color, variant, size, fullWidth, ...rest
  };

  if (href && href.startsWith('/')) {
    return (
      <Link href={href} passHref legacyBehavior>
        <Button {...commonMuiButtonProps}>
          {children}
        </Button>
      </Link>
    );
  } else if (href) {
    return (
      <Button component="a" href={href} {...commonMuiButtonProps}>
        {children}
      </Button>
    );
  }

  // No href, or external href not starting with /
  return (
    <Button
      {...commonMuiButtonProps}
      type={rest.type || "submit"} // Default to type="submit" if no href
    >
      {children}
    </Button>
  );
};

export default AuthButton;
