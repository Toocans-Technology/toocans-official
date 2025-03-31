'use client'

import React from 'react';
import { Box, Typography, Button, Stack, Card, CardContent, 
    List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Avatar, Divider, Snackbar } 
    from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Image from 'next/image';
import LpHeader from '@/app/components/landingpage/header/Header';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { maskEmail, maskPhone } from '@/utils/dataUtils';


export default function Account() {
  const [activeButton, setActiveButton] = React.useState('deposit');
  const [showBalance, setShowBalance] = React.useState(true);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [copySuccess, setCopySuccess] = React.useState(false);


  const handleCopy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(message);
      setOpenSnackbar(true);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const buttonSx = {
    bgcolor: '#f5f5f5', 
    color: '#222222', 
    border: 'none',
    minWidth: '80px',
    borderRadius: '36px',
    '&:hover': {
      bgcolor: '#f5f5f5',
      border: 'none',
      boxShadow: 'none',
      color: '#555555', 
    }
  };

  return (
    // <Box sx={{ bgcolor: '#EAEFF4', minHeight: '100vh', p: 3 }}>
      <PageContainer title="Overview" description="Account">
      <LpHeader />
      <Box sx={{ 
        bgcolor: '#EAEFF4', 
        minHeight: '100vh',
        px: {
          xs: 2,    
          sm: 4,    
          md: 8,    
          lg: 24,   
          xl: 32,   
        },
        py: {
          xs: 4,
          sm: 6,
          md: 8,
        }
      }}>
        <Typography variant="h2" sx={{ mb: 2, color: '#000' }}>Account</Typography>
        <Card sx={{ mb: 4, bgcolor: '#fff', color: '#666666' }}>
          <CardContent>
          <Stack spacing={2} bgcolor={'#FFF3A5'} p={2} borderRadius={1}>
          <Typography variant="body1" fontSize={12}>
            Your account security level is low. Please set up the following as soon as possible.
          </Typography>
          <Typography 
          color={"#222222"}
          fontWeight={500}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            Google 2FA Authentication 
            <ArrowForwardIosOutlinedIcon sx={{ fontSize: 14 }} />
          </Typography>
          </Stack>

          <Stack spacing={2} mt={4}>
            {/* User Info Section */}
            <Box sx={{ display: { xs: 'block', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Avatar>S</Avatar>
              <Stack spacing={0.5} >
                <Box sx={{ display: { xs: 'flex', sm: 'block' }, alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                  <Typography color="#222222">Sunny***@gmail.com</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">UID:123456</Typography>
                    {copySuccess ? (
                      <CheckIcon 
                        sx={{ 
                          fontSize: 14, 
                          cursor: 'pointer', 
                          color: '#9CFF1F'
                        }} 
                      />
                    ) : (
                      <ContentCopyIcon 
                        onClick={() => handleCopy('123456', 'UID copied to clipboard')}
                        sx={{ 
                          fontSize: 14, 
                          cursor: 'pointer', 
                          color: 'text.secondary' 
                        }} 
                      />
                    )}
                  </Box>
                </Box>
              </Stack>
              
              {/* <Box sx={{ ml: { xs: 0, sm: 'auto'}, display: 'flex', alignItems: 'center', gap: 2, padding: '8px 0' }}>
                <Typography variant="body2" color="#666666">Identity verification</Typography>
                <Typography color="#FD6384" bgcolor={'#FD638433'} borderRadius={1} fontSize={12} textAlign={'center'} padding={'8px 20px'} width={'auto'}>Unverified</Typography>
              </Box> */}

              <Box sx={{ ml: { xs: 0, sm: 'auto'}, display: { xs: 'flex', sm: 'block' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="body2" color="#666666">Identity verification</Typography>
                <Typography color="#FD6384" bgcolor={'#FD638433'} borderRadius={0.5} fontSize={12} textAlign={'center'} width={80}>Unverified</Typography>
              </Box>
              <Box sx={{ ml: { xs: 0, sm: 'auto'}, display: { xs: 'flex', sm: 'block' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">Security Level</Typography>
                <Typography color="#222222">Low</Typography>
              </Box>
              
            </Box>
            <Divider variant="middle" sx={{ borderColor: '#F4F4F4' }} />

            {/* Account Settings */}
            <Stack spacing={3} sx={{ mt: 2 }}>
             
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography color="#222222" fontWeight={500} sx={{ width: { xs: '100px', sm: '200px' }}}>Nickname</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                  <Typography color="text.secondary">{maskEmail('abcd@gmail.com')}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ ...buttonSx, padding: '8px 20px' }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>Change</Typography>
                  </Button>
                </Box>
              </Box>

              {/* User ID */}
              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="#222222" fontWeight={500}  sx={{ width: 200 }}>User ID</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary">123123123</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={buttonSx}
                  onClick={() => handleCopy('123123123', 'User ID copied to clipboard')}
                >
                  Copy
                </Button>
              </Box> */}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography color="#222222" fontWeight={500} sx={{ width: { xs: '100px', sm: '200px' }}}>User ID</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                  <Typography color="text.secondary">{maskPhone('123123123')}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ ...buttonSx, padding: '8px 20px' }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>Change</Typography>
                  </Button>
                </Box>
              </Box>

              <Divider variant="middle" sx={{ borderColor: '#F4F4F4' }} />


              {/* Email Authentication */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ width: { xs: '100px', sm: '200px'} }}>
                  <Typography color="#222222"  sx={{ width: 150 }}>
                    Email Authentication
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    For login, withdraw, password retrieval, security settings change.
                  </Typography>
                </Box>
                <Box>
                    <Typography color="text.secondary">{maskEmail('abcd@gmail.com')}</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={buttonSx}
                  onClick={() => handleCopy('abcde@gmail.com', 'Email copied to clipboard')}
                >
                  Copy
                </Button>
              </Box>

              {/* Phone Authentication */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ width: { xs: '100px', sm: '200px'} }}>
              <Typography color="#222222"  sx={{ width: 150 }}>Phone Authentication</Typography>
                  <Typography variant="body2" color="text.secondary">
                    For login, password retrieval, security settings change.
                  </Typography>
                </Box>
                <Box>
                <Typography color="#222222" height={2}>{maskPhone('123123123')}</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={buttonSx}
                >
                  Settings
                </Button>
              </Box>
              <Divider variant="middle" sx={{ borderColor: '#F4F4F4' }} />

              {/* Login Password */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ width: 200 }}>
                  <Typography color="#222222">Login Password</Typography>
                </Box>
                <Box>
                <Typography color="text.secondary">Not yet configured</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={buttonSx}
                >
                  Settings
                </Button>
              </Box>

              {/* Authentication App */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ width: 200 }}>
                  <Typography color="#222222">Authentication App</Typography>
                  <Typography variant="body2" color="text.secondary" width={{ xs: '120px', sm: '250px'}}>
                    Use authentication codes when managing assets and other functions
                  </Typography>
                </Box>
                <Box>
                <Typography color="text.secondary">Not yet configured</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={buttonSx}
                >
                  Settings
                </Button>
              </Box>
            </Stack>
          </Stack>
          </CardContent>
        </Card>
        </Box>
      </PageContainer>
    
  );
}

Account.layout = "Blank";
