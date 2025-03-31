import React from 'react';
import { Box, Button, InputAdornment } from '@mui/material';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

interface VerificationCodeInputProps {
  countdown: number;
  handleSendCode: () => void;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ 
  countdown, 
  handleSendCode 
}) => {
  return (
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
  );
};

export default VerificationCodeInput;
