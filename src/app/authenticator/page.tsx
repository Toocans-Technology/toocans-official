'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  TextField, 
  Button, 
  Grid, 
  IconButton, 
  Tooltip,
  Divider,
  InputAdornment
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LpHeader from '@/app/components/landingpage/header/Header';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";


export default function Authenticator() {
  const [authenticatorCode, setAuthenticatorCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const secretKey = '123123123123'; // This would be fetched from backend in a real implementation

  const handleVerification = () => {
    setIsSubmitting(true);
    // Simulate API verification
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Verification successful!');
    }, 1500);
  };

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
  };

  return (
    <PageContainer title="Authenticator Setup" description="Set up two-factor authentication">
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
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h2" sx={{ mb: 2, color: '#000' }}>
            Authenticator app
          </Typography>
          
          <Card sx={{ p: 4, borderRadius: 2, bgcolor: '#fff', color: '#666666' }}>
            <Typography variant="h6" fontWeight={500} sx={{ mb: 4 }}>
              Set Up Two-Factor Authentication
            </Typography>
            <Divider variant="middle" sx={{ borderColor: '#F4F4F4' }} />


            
            {/* Step 1: Download authenticator */}
            <Box sx={{ mt:4,mb: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    fontWeight: 'bold',
                    fontSize:'12px'
                  }}
                >
                  1
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Download authenticator
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ ml: 3.5, mb: 2 }}>
                Download Google Authenticator Android/iOS
              </Typography>
              
              <Grid container spacing={{ xs: 0, sm: 2 }} sx={{ ml: 0, mt: 1 }}>
                <Grid item xs={12} sm='auto'>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box 
                      component="img"
                      src="/images/app/qr-ios.png" // Replace with actual QR code image
                      alt="iOS QR Code"
                      sx={{ width: 80, height: 80}}
                    />
                    <Typography variant="body2">iOS</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm='auto'>
                  <Box sx={{ textAlign: 'center', pl: { xs: 0, sm: 5 } }}>
                    <Box 
                      component="img"
                      src="/images/app/qr-android.png" // Replace with actual QR code image
                      alt="Android QR Code"
                      sx={{ width: 80, height: 80}}
                    />
                    <Typography variant="body2">Android</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Step 2: Scan QR code */}
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    fontWeight: 'bold',
                    fontSize:'12px'
                  }}
                >
                  2
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Scan QR code
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ ml: 3.5, mb: 3 }}>
              Open Google Authenticator, scan the QR code below or manually enter the key phrase to activate the verification token. Key phrase is used to recover Google Authenticator in the event of a loss or change of device — please make sure to keep the key phrase safe before setting up Google Authenticator.              
              </Typography>
              
              <Box sx={{ ml: 3.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'inline-block', p: 2, mb: 3, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)'}}>
                  <Box 
                    component="img"
                    src="/images/app/qr-setup.png" // Replace with actual QR code for setup
                    alt="Setup QR Code"
                    sx={{ width: 70, height: 70}}
                  />
                </Box>
                
                <Box width={"240px"} sx={{ display: 'flex',flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" align='left' fontSize={14}>
                    Or manually enter the code below
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontWeight="500" fontSize={14} color="#222222" >
                      {secretKey}
                    </Typography>
                    <Tooltip title="Copy code">
                      <IconButton size="small" onClick={handleCopySecretKey}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Step 3: Security authentication */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    fontWeight: 'bold',
                    fontSize:'12px'
                  }}
                >
                  3
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Security authentication
                </Typography>
              </Box>
              
              <Box sx={{ ml: 5, mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
                  Google authenticator code
                </Typography>
                <CustomTextField 
                id="authenticator-code" 
                variant="outlined" 
                fullWidth 
                placeholder="Enter 6-digit generated code from your app"
                sx={{
                    width: { xs: '80%', sm: '50%' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiOutlinedInput-root': {
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    color: '#000'
                  }
                }}
              />
              </Box>
              <Box sx={{ ml: 5, mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: '500' }}>
                Email authentication code
                </Typography>
                <CustomTextField 
                id="authenticator-code" 
                variant="outlined" 
                fullWidth 
                placeholder="Enter 6-digit email authentication code"
                sx={{
                  width: { xs: '80%', sm: '50%' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiOutlinedInput-root': {
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    color: '#000'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button 
                        variant="contained" 
                        sx={{ 
                          backgroundColor: '#9CFF1F', 
                          color: '#000',
                          borderRadius: '36px',
                          marginRight: -1,
                          height: '24px',
                          fontSize: '12px',
                          '&:hover': { backgroundColor: '#8FE71E' }
                        }}
                      >
                        Send
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
              
              </Box>
              <Box sx={{ ml: 5, mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disableElevation
                  onClick={handleVerification}
                //   disabled={authenticatorCode.length < 6 || isSubmitting}
                  sx={{ 
                    width: '50%',
                    py: 1.2,
                    bgcolor: '#9CFF1F',
                    '&:hover': {
                      bgcolor: '#8ee825'
                    },
                    borderRadius: 36,
                    color: 'black',
                    fontWeight: 'medium'
                  }}
                >
                  {isSubmitting ? 'Verifying...' : 'Deposit'}
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
}

Authenticator.layout = "Blank";
