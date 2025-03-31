import React from 'react';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";

const EmailInput: React.FC = () => {
  return (
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
  );
};

export default EmailInput;
