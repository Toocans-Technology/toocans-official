import React from 'react';
import AuthButton from '@/app/components/forms/theme-elements/AuthButton';

interface AuthSubmitButtonProps {
  isForgotPassword?: boolean; // Made optional as it might not always be relevant
  onClick?: () => void;
  disabled?: boolean;
  href?: string; // Added href as it was implicitly used before
}

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({ isForgotPassword, onClick, disabled, href }) => {
  const buttonText = isForgotPassword ? 'Next' : 'Sign In';

  if (onClick) {
    return (
      <AuthButton onClick={onClick} disabled={disabled}>
        {buttonText}
      </AuthButton>
    );
  }

  // Default to href if onClick is not provided, maintaining original behavior if needed
  return (
    <AuthButton href={href || "/"} disabled={disabled}>
      {buttonText}
    </AuthButton>
  );
};

export default AuthSubmitButton;