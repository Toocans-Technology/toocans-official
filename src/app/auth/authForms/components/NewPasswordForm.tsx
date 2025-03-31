import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PasswordRulesChecker from './PasswordRulesChecker';
import AuthButton from '@/app/components/forms/theme-elements/AuthButton';

interface NewPasswordFormProps {
  onSubmit: () => void;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const rules = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    length: password.length >= 8 && password.length <= 32,
  };
  
  const isPasswordValid = Object.values(rules).every(rule => rule);
  const doPasswordsMatch = password === confirmPassword && password !== '';

  return (
    <Box>
      <Box display="flex" gap={2} mb={1}>
        <Box 
          sx={{ 
            color: '#222',
            fontWeight: 500,
            fontSize: '14px'
          }}
        >
          Password
        </Box>
      </Box>
      
      <CustomTextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiOutlinedInput-root': {
            background: '#f5f5f5 !important',
            borderRadius: '8px',
            color: '#000',
            mb: 3
          }
        }}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? 
                <VisibilityOffOutlinedIcon sx={{ color: '#000' }} /> : 
                <VisibilityOutlinedIcon sx={{ color: '#000' }} />
              }
            </IconButton>
          ),
        }}
      />
      
      <PasswordRulesChecker rules={rules} />

      <Box sx={{ mb: 2 }}>
        <Box mb={1}>
          <Typography 
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="confirm-password"
            mb="5px"
            color="#666"
          >
            Confirm Password
          </Typography>
        </Box>
        <CustomTextField
          fullWidth
          type="password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiOutlinedInput-root': {
              background: '#f5f5f5',
              borderRadius: '8px',
              color: '#000',
              mb: 3
            }
          }}
        />
      </Box>

      <Box mb={1}>
        <AuthButton
          disabled={!isPasswordValid || !doPasswordsMatch}
          onClick={onSubmit}
        >
          Next
        </AuthButton>
      </Box>
    </Box>
  );
};

export default NewPasswordForm;
