'use client';


import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  FormControl,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';



export interface TokenOption {
  symbol: string;
  name: string;
  color?: string;
  icon: string;
  iconBg: string;
}

interface TokenDropdownProps {
  options: TokenOption[];
  selectedToken: string;
  onTokenSelect: (token: string) => void;
  placeholder?: string;
  label?: string;
}




interface TokenDropdownProps {
  options: TokenOption[];
  selectedToken: string;
  onTokenSelect: (token: string) => void;
  placeholder?: string;
  label?: string;
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({
  options,
  selectedToken,
  onTokenSelect,
  placeholder = 'Search token',
  label
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdRef.current && !dropdRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTokenSelect = (symbol: string) => {
    onTokenSelect(symbol);
    setDropdownOpen(false);
    setSearchQuery('');
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTokenSelection = (token: string) => {
    onTokenSelect(token);
    setDropdownOpen(false);
    setSearchQuery(''); // Reset search query when a token is selected
  };

  const filteredOptions = options.filter(option => 
    option.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FormControl fullWidth variant="filled" sx={{ mb: 2, position: 'relative' }}>
      {selectedToken ? (
        // Display selected token as a button
        <Button
          fullWidth
          variant="text"
          sx={{
            justifyContent: 'space-between',
            textTransform: 'none',
            padding: '8px 20px',
            color: '#666666',
            bgcolor: '#F8F8F8',
            boxShadow: 'none',
            minWidth: 'auto',
            fontSize: '14px',
            fontWeight: 400,
            '&:hover': {
              bgcolor: '#F8F8F8',
              color: '#222222'
            },
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          startIcon={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                component="span"
                sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: options.find(c => c.symbol === selectedToken)?.iconBg || '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              >
                {options.find(c => c.symbol === selectedToken)?.icon || ''}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body1" fontWeight="medium">{selectedToken}</Typography>
              <Typography variant="caption" color="textSecondary">
                {options.find(c => c.symbol === selectedToken)?.name || ''}
              </Typography>
            </Box>
          </Box>
          }
          endIcon={
            <KeyboardArrowDownIcon 
              fontSize="small" 
              sx={{ 
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} 
            />
          }
        >
          
        </Button>
      ) : (
        // Display search field when no token is selected
        <TextField
          placeholder="Search token"
          value={searchQuery}
          fullWidth
          variant="outlined"
          size="small"
          className="search-token-input"
          sx={{ 
            mt: 0, 
            '& .MuiOutlinedInput-root': {
              height: '44px',
              borderRadius: '4px',
              background: '#F8F8F8',
              '&:hover': {
                bgcolor: '#F8F8F8'
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: '0px',
            },
            '& .MuiOutlinedInput-input': {
              backgroundColor: '#F8F8F8',
              color: '#999999',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 400
            }
          }}
          inputProps={{
            style: { background: '#F8F8F8', color: '#999999' }
          }}
          autoFocus
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, color: '#aaa' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </Box>
            ),
            endAdornment: (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '8px 20px',
                  cursor: 'pointer',
                  bgcolor: '#F8F8F8',
                  color: '#666666',
                  fontSize: '14px',
                  fontWeight: 400,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#F8F8F8',
                    color: '#222222',
                    fontWeight: 500
                  },
                  height: '100%',
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <KeyboardArrowDownIcon 
                  fontSize="small" 
                  sx={{ 
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }} 
                />
              </Box>
            ),
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
      )}
      
      {dropdownOpen && (
        <Card sx={{ 
          position: 'absolute', 
          width: '100%', 
          zIndex: 10, 
          top: '100%', 
          left: 0,
          bgcolor: '#F8F8F8',
          boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
          mt: 1,
          maxHeight: 300,
          overflow: 'auto',
          padding: '4px 0'
        }}>
          <Box sx={{ p: 0 }}>
            <style jsx global>{`
              /* Target all possible variations of the Material-UI input class */
              .MuiInputBase-root.MuiOutlinedInput-root,
              [class*="MuiInputBase-root-MuiOutlinedInput-root"],
              .search-token-input .MuiInputBase-root {
                background: #F8F8F8 !important;
              }
            `}</style>
            <TextField 
              placeholder="Search token" 
              fullWidth 
              size="small" 
              className="search-token-input"
              sx={{ 
                mt: 0, 
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  borderRadius: '4px',
                  background: '#F8F8F8',
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    background: '#F0F0F0'
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '0px',
                },
                '& .MuiOutlinedInput-input': {
                  backgroundColor: 'transparent',
                  color: '#999999',
                  fontSize: '14px',
                  fontWeight: 400,
                  padding: 0,
                  height: '24px',
                  lineHeight: '24px'
                }
              }}
              inputProps={{
                style: { background: '#F8F8F8', color: '#999999' }
              }}
              autoFocus
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: '2px', color: '#999999', display: 'flex', alignItems: 'center', height: '24px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  </Box>
                ),
              }}
            />
            <List sx={{ p: '4px 0', '& .MuiListItem-root': { minHeight: '40px' } }}>
              {/* Filter options based on search query */}
              {filteredOptions.map((option, index) => (
                <ListItem 
                  key={index}
                  button 
                  onClick={() => handleTokenSelection(option.symbol)}
                  sx={{ 
                    gap: 2,
                    padding: '8px 20px',
                    bgcolor: '#FFF',
                    color: '#666666',
                    fontSize: '14px',
                    fontWeight: 400,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid transparent',
                    '&:hover': {
                      bgcolor: '#F8F8F8',
                      color: '#222222',
                      fontWeight: 500
                    }
                  }}
                >
                  <Box 
                    component="span"
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: option.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 'bold',
                      flexShrink: 0,
                      mr: '2px'
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '24px', ml: '2px' }}>
                    <Typography variant="body2" fontWeight={400} color="#666666" sx={{ fontSize: '14px', flexShrink: 0, display: 'flex', alignItems: 'center', lineHeight: '24px' }}>
                      {option.symbol}
                    </Typography>
                    <Typography variant="caption" color="#666666" sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', lineHeight: '24px' }}>
                      {option.name}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
              
              {/* Show a message when no results are found */}
              {filteredOptions.length === 0 && (
                <ListItem sx={{ padding: '8px 20px', justifyContent: 'center', bgcolor: '#F8F8F8' }}>
                  <Typography variant="body2" color="#666666" sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'center' }}>
                    No tokens found
                  </Typography>
                </ListItem>
              )}
            </List>
          </Box>
        </Card>
      )}
    </FormControl>
  );
};

export default TokenDropdown;
