import React from 'react';
import { Box, InputAdornment } from '@mui/material';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

interface PasswordInputProps {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  showPassword, 
  setShowPassword 
}) => {
  return (
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
                {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
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
  );
};

export default PasswordInput;
