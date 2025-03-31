import React from 'react';
import AuthButton from '@/app/components/forms/theme-elements/AuthButton';

interface AuthSubmitButtonProps {
  isForgotPassword: boolean;
}

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({ isForgotPassword }) => {
  return (
    <AuthButton href="/">
      {isForgotPassword ? 'Next' : 'Sign In'}
    </AuthButton>
  );
};

export default AuthSubmitButton;