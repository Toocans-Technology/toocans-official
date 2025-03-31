import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
} from '@mui/material';

export interface TokenOption {
  symbol: string;
  name: string;
  icon: string;
  iconBg: string;
}

export interface TokenDropdownProps {
  options: TokenOption[];
  selectedToken: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({
  options,
  selectedToken,
  onChange,
  placeholder = 'Select token',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: any, newValue: string | null) => {
    if (newValue) {
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      value={selectedToken}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options.map((option) => option.symbol)}
      getOptionLabel={(option) => {
        const selectedOption = options.find((opt) => opt.symbol === option);
        return selectedOption ? selectedOption.name : '';
      }}
      sx={{
        backgroundColor: '#F8F8F8',
        color: '#222222',
        '& .MuiAutocomplete-input': {
          backgroundColor: '#F8F8F8',
          color: '#222222',
        },
        '& .MuiInputBase-input': {
          backgroundColor: '#F8F8F8',
          color: '#222222',
        },
        borderRadius: 2
      }}
      renderOption={(props, option) => {
        const selectedOption = options.find((opt) => opt.symbol === option);
        return (
          <li {...props}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: selectedOption?.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {selectedOption?.icon}
              </Box>
              <Typography sx={{ color: '#222222' }}>
                {selectedOption?.name}
              </Typography>
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: 1,
            bgcolor: '#F8F8F8',
            cor: '#222222',
            '& .MuiOutlinedInput-root': {
              border: 'none',
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiAutocomplete-input': {
              display: 'flex',
              alignItems: 'center',
              color: '#222222',
            },
            '& .MuiInputBase-input': {
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 400,
            },
          }}
        />
      )}
    />
  );
};

export default TokenDropdown;
