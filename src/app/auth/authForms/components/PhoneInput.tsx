import React from 'react';
import { Box, Autocomplete, TextField, MenuItem, Paper } from '@mui/material';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Country } from '../types/auth';

interface PhoneInputProps {
  countryCodes: Country[];
  selectedCountry: string;
  setSelectedCountry: (code: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  countryCodes, 
  selectedCountry, 
  setSelectedCountry 
}) => {
  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      '& .MuiOutlinedInput-root': {
        background: '#f5f5f5',
        borderRadius: '8px',
        border: 'none'
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      }
    }}>
      <Autocomplete
        value={countryCodes.find(c => c.nationalCode === selectedCountry) || undefined}
        onChange={(_, newValue) => {
          setSelectedCountry(newValue?.nationalCode || '');
        }}
        options={countryCodes}
        getOptionLabel={(option) => `+${option.nationalCode}`}
        ListboxProps={{
          style: {
            backgroundColor: '#fff',
            color: '#000',
            padding: '8px 0'
          }
        }}
        PaperComponent={({ children }) => (
          <Paper sx={{
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            marginTop: '4px'
          }}>{children}</Paper>
        )}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id} sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#000',
            backgroundColor: '#fff',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            },
            '&.Mui-focused': {
              backgroundColor: '#f5f5f5',
              color: '#000',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                color: '#000'
              },
            },
          }}>
            <img
              src={`https://flagcdn.com/w20/${option.domainShortName?.toLowerCase()}.png`}
              alt={option.countryEnName || ''}
              style={{
                width: '20px',
                height: '15px',
                objectFit: 'cover',
                borderRadius: '2px',
              }}
              loading="lazy"
            />
            +{option.nationalCode}
          </MenuItem>
        )}
        renderInput={(params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {selectedCountry && countryCodes.find(c => c.nationalCode === selectedCountry) && (
              <img
                src={`https://flagcdn.com/w20/${countryCodes.find(c => c.nationalCode === selectedCountry)?.domainShortName?.toLowerCase()}.png`}
                alt={countryCodes.find(c => c.nationalCode === selectedCountry)?.countryEnName || ''}
                style={{
                  width: '20px',
                  height: '15px',
                  objectFit: 'cover',
                  borderRadius: '2px',
                  position: 'absolute',
                  left: '8px',
                  zIndex: 1
                }}
                loading="lazy"
              />
            )}
            <TextField
              {...params}
              sx={{
                '& .MuiInputBase-input': {
                  color: '#000',
                  paddingLeft: selectedCountry ? '32px !important' : '14px',
                  width: '125px',
                  height: '27px'
                }
              }}
            />
          </Box>
        )}
        disableClearable
        size="small"
      />
      <CustomTextField
        id="phone"
        variant="outlined"
        fullWidth
        placeholder="Enter Phone Number"
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

export default PhoneInput;
