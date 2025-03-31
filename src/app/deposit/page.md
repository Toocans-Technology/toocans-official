'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  TextField, 
  Button, 
  IconButton, 
  Tooltip,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

interface DepositRecord {
  token: string;
  amount: string;
  time: string;
}
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TokenDropdown, { TokenOption } from '@/app/components/shared/TokenDropdown';
import LpHeader from '@/app/components/landingpage/header/Header';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { color } from 'framer-motion';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{
        display: value !== index ? 'none' : 'block',
        padding: '8px 0'
      }}
    >
      {value === index && children}
    </div>
  );
}

// Function to mask phone numbers according to the specified format
const maskPhoneNumber = (phone: string) => {
  if (!phone || phone.length < 5) return phone;
  return `${phone.substring(0, 2)}***${phone.substring(phone.length - 3)}`;
};

// Function to mask email addresses according to the specified format
const maskEmail = (email: string) => {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  return `${username.substring(0, 2)}***@${domain.substring(0, 2)}***`;
};

// Sample data for crypto balances
const cryptoBalances = [
  { symbol: 'USDT', balance: '123,983.00', name: 'Tether', color: '#26C6DA', icon: '$' },
  { symbol: 'BTC', balance: '0.12345678', name: 'Bitcoin', color: '#F7931A', icon: '₿' },
  { symbol: 'ETH', balance: '2.3456', name: 'Ethereum', color: '#627EEA', icon: 'Ξ' }
];

// Data for cryptocurrency dropdown
const cryptocurrencies = [
  { symbol: 'USDT', name: 'Tether', color: '#26C6DA', icon: '$', iconBg: '#26C6DA' },
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', icon: '₿', iconBg: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', icon: 'Ξ', iconBg: '#627EEA' },
  { symbol: 'BNB', name: 'Binance Coin', color: '#F3BA2F', icon: 'B', iconBg: '#F3BA2F' },
  { symbol: 'SOL', name: 'Solana', color: '#14F195', icon: 'S', iconBg: '#14F195' },
  { symbol: 'ADA', name: 'Cardano', color: '#0033AD', icon: 'A', iconBg: '#0033AD' },
  { symbol: 'XRP', name: 'Ripple', color: '#23292F', icon: 'X', iconBg: '#23292F' },
  { symbol: 'DOT', name: 'Polkadot', color: '#E6007A', icon: 'D', iconBg: '#E6007A' },
  { symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633', icon: 'D', iconBg: '#C2A633' },
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142', icon: 'A', iconBg: '#E84142' },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5', icon: 'M', iconBg: '#8247E5' },
  { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA', icon: 'L', iconBg: '#2A5ADA' }
];

// Sample data for networks
const networks: TokenOption[] = [
  { symbol: 'TRON', name: 'Tron (TRC20)', icon: 'T', iconBg: '#EF0027' },
  { symbol: 'ETH', name: 'Ethereum (ERC20)', icon: 'Ξ', iconBg: '#627EEA' },
  { symbol: 'BNB', name: 'BNB Smart Chain (BEP20)', icon: 'B', iconBg: '#F3BA2F' },
  { symbol: 'MATIC', name: 'Polygon', icon: 'M', iconBg: '#8247E5' }
];

export default function Deposit() {
  // Deposit data
  const usdtDeposits: DepositRecord[] = [
    {
      token: 'USDT',
      amount: '+ 102.12',
      time: '2021-05-21 13:20:00'
    },
    {
      token: 'USDT',
      amount: '+ 200',
      time: '2021-05-21 13:20:00'
    }
  ];

  const recentDeposits: DepositRecord[] = [
    {
      token: 'BTC',
      amount: '+ 0.0023',
      time: '2021-05-21 13:20:00'
    },
    {
      token: 'ETH',
      amount: '+ 1.5',
      time: '2021-05-21 13:20:00'
    }
  ];

  // Token selection state
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Crypto dropdown state
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [cryptoDropdownOpen, setCryptoDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Network dropdown state
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  
  // Copy notification state
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  const handleTokenChange = (token: string) => {
    setSelectedToken(token);
    setSelectedCrypto(token); // Also update the selectedCrypto state
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  const handleCryptoSelection = (crypto: string) => {
    setSelectedCrypto(crypto);
    setCryptoDropdownOpen(false);
    setSearchQuery(''); // Reset search query when a token is selected
  };
  
  const handleNetworkSelection = (network: string) => {
    setSelectedNetwork(network);
    setNetworkDropdownOpen(false);
  };

  return (
    <PageContainer title="Deposit" description="Deposit funds to your account">
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
          {/* Deposit Form Card */}
          <Card sx={{ borderRadius: 2, bgcolor: '#fff', color: '#666666', mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Step 1: Choose token to deposit */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: '#000', // Always #000 for step 1
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#000' }}>
                    Choose token to deposit
                  </Typography>
                </Box>
                
                <Box sx={{ ml: 4 }}>
                  <TokenDropdown
                    options={cryptocurrencies}
                    selectedToken={selectedCrypto}
                    onTokenSelect={handleCryptoSelection}
                    placeholder="Search token"
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button 
                      variant='text'
                      onClick={() => handleTokenChange('USDT')}
                      sx={{ 
                        borderRadius: 1, 
                        padding: '8px 20px',
                        color: selectedToken === 'USDT' ? '#222222' : '#666666',
                        bgcolor: '#F8F8F8',
                        '&:hover': {
                          bgcolor: '#F8F8F8',
                          color: '#222222',
                          fontWeight: 500
                        },
                        textTransform: 'none',
                        minWidth: 'auto',
                        boxShadow: 'none',
                        fontSize: '14px',
                        fontWeight: selectedToken === 'USDT' ? 500 : 400,
                        transition: 'all 0.2s'
                      }}
                      startIcon={
                        <img src="/images/logos/usdt-icon.svg" alt="USDT" />
                      }
                    >
                      USDT
                    </Button>
                    
                    <Button 
                      variant='text'
                      onClick={() => handleTokenChange('BTC')}
                      sx={{ 
                        borderRadius: 1, 
                        padding: '8px 20px',
                        bgcolor: '#F8F8F8',
                        color: selectedToken === 'BTC' ? '#222222' : '#666666',
                        '&:hover': {
                          bgcolor: '#F8F8F8',
                          color: '#222222',
                          fontWeight: 500
                        },
                        textTransform: 'none',
                        minWidth: 'auto',
                        boxShadow: 'none',
                        fontSize: '14px',
                        fontWeight: selectedToken === 'BTC' ? 500 : 400,
                        transition: 'all 0.2s'
                      }}
                      startIcon={
                        <Box 
                          component="span" 
                          sx={{ 
                            width: 20, 
                            height: 20, 
                            borderRadius: '50%', 
                            bgcolor: '#F7931A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 'bold'
                          }}
                        >
                          ₿
                        </Box>
                      }
                    >
                      BTC
                    </Button>
                    
                    <Button 
                      variant='text'
                      onClick={() => handleTokenChange('ETH')}
                      sx={{ 
                        borderRadius: 1, 
                        padding: '8px 20px',
                        bgcolor: '#F8F8F8',
                        color: selectedToken === 'ETH' ? '#222222' : '#666666',
                        '&:hover': {
                          bgcolor: '#F8F8F8',
                          color: '#222222',
                          fontWeight: 500
                        },
                        textTransform: 'none',
                        minWidth: 'auto',
                        boxShadow: 'none',
                        fontSize: '14px',
                        fontWeight: selectedToken === 'ETH' ? 500 : 400,
                        transition: 'all 0.2s'
                      }}
                      startIcon={
                        <img src="/images/logos/eth-icon.svg" alt="ETH" />
                      }
                    >
                      ETH
                    </Button>
                  </Box>
                </Box>
              </Box>
              
              {/* Step 2: Choose network */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: selectedCrypto ? '#000' : '#999999', // #000 if token is selected, otherwise #999999
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: selectedCrypto ? '#000' : '#999999' }}>
                    Choose network
                  </Typography>
                  
                </Box>
                <Box sx={{ ml: 4, mt: 1.5 }}>
                    { selectedCrypto &&<TokenDropdown
                      options={networks}
                      selectedToken={selectedNetwork}
                      onTokenSelect={handleNetworkSelection}
                      placeholder="Search network"
                      label="Select network"
                    />}
                  </Box>
              </Box>
              
              {/* Step 3: Deposit details */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: selectedNetwork ? '#000' : '#999999',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    3
                  </Box>
                  <Typography variant="subtitle1" fontSize={12} fontWeight="bold" sx={{ color: selectedNetwork ? '#000' : '#999999' }}>
                    Deposit details
                  </Typography>
                </Box>
                {selectedNetwork && (
                  <Box sx={{ ml: 4, mt: 1.5, backgroundColor: '#F8F8F8', borderRadius: '4px', p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {/* QR Code */}
                      <Tooltip title="Scan QR code to get deposit address" placement="top" arrow>
                        <Box sx={{ 
                          width: 120, 
                          height: 120, 
                        //   bgcolor: '#fff',
                        //   border: '1px solid #E5E7EB',
                          borderRadius: '4px',
                        //   p: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#D1D5DB',
                            bgcolor: '#F8F8F8'
                          }
                        }}>
                          <img 
                            src={"/images/logos/code.png"}
                            alt="Deposit Address QR Code"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </Box>
                      </Tooltip>
                      {/* Deposit Address */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="#666666" gutterBottom>
                          Deposit address
                        </Typography>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            bgcolor: '#F8F8F8',
                            p: '8px 20px',
                            borderRadius: '4px',
                            mb: showCopyNotification ? 1 : 3,
                            border: '1px solid #E5E7EB',
                            width: '100%'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            component="span"
                            sx={{ 
                              fontFamily: 'monospace',
                              color: '#222222',
                              flex: 1,
                              userSelect: 'all',
                              fontSize: '14px',
                              textAlign: 'left'
                            }}
                          >
                            0xUQAaGjxckIhrd4zUkBC8IG_pkT307zJrN_IfMUnI0oZ6g
                          </Typography>
                          <Tooltip title="Click to copy" placement="top" arrow>
                            <Box 
                              component="button"
                              onClick={() => {
                                navigator.clipboard.writeText('0xUQAaGjxckIhrd4zUkBC8IG_pkT307zJrN_IfMUnI0oZ6g');
                                setShowCopyNotification(true);
                                setTimeout(() => setShowCopyNotification(false), 2000);
                              }}
                              sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                color: showCopyNotification ? '#059669' : '#666666',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'none',
                                padding: 0,
                                transition: 'color 0.2s',
                                '&:hover': {
                                  color: showCopyNotification ? '#059669' : '#222222'
                                }
                              }}
                            >
                              {showCopyNotification ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg>
                              ) : (
                                <ContentCopyIcon fontSize="small" />
                              )}
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
                <Box sx={{ ml: 4, mt: 1.5, display: 'flex', justifyContent:'space-between' }}>
                  <Typography variant="subtitle1" sx={{ color: '#666666' }}>
                    Minimum deposit
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#000' }}>
                    100 USDT
                  </Typography>
                </Box>
              </Box>
              
            </CardContent>
          </Card>

          {/* Deposits History */}
          <Card sx={{ mt: 3, bgcolor: '#FFF' }}>
            <CardContent>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                // variant="fullWidth"
                sx={{
                  mb: 3,
                  minHeight: 'unset',
                  '& .MuiTabs-indicator': {
                    display: 'none' // Hide default indicator
                  },
                  '& .MuiTabs-flexContainer': {
                    gap: '8px', // Consistent with Element Plus spacing
                    padding: '0 8px' // Add padding for better visual balance
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    color: '#666666',
                    padding: '8px 20px', // Following Element Plus padding guideline
                    minHeight: 'unset',
                    minWidth: 'auto',
                    fontWeight: 400,
                    fontSize: '14px',
                    position: 'relative',
                    margin: '0 4px',
                    
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',

                      width: '50px', // Slightly shorter for better visual balance
                      height: '2px',
                      backgroundColor: 'transparent',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '1px'
                    },
                    '&:hover': {
                      color: '#000',
                      backgroundColor: 'transparent'
                    },
                    '&.Mui-selected': {
                      color: '#000',
                      fontWeight: 500,
                      '&::before': {
                        backgroundColor: '#000'
                      }
                    }
                  }
                }}
              >
                <Tab label="USDT Deposits" />
                <Tab label="Recent Deposits" />
              </Tabs>

              <TabPanel value={selectedTab} index={0}>
                {/* USDT Deposits Table */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr',
                  bgcolor: '#F8F8F8',
                  p: '8px 20px',
                  borderRadius: '4px'
                }}>
                  <Typography variant="subtitle2" color="#666666">Token</Typography>
                  <Typography variant="subtitle2" color="#666666">Amount</Typography>
                  <Typography variant="subtitle2" color="#666666">Time</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {usdtDeposits.map((deposit: DepositRecord, index: number) => (
                    <Box
                      key={`usdt-${index}`}
                      sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr',
                        p: '8px 20px', // Following Element Plus padding guideline
                        borderBottom: '1px solid #E5E7EB',
                        color: '#666666',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(64, 158, 255, 0.1)' // Element Plus primary color with opacity
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>{deposit.token}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#10B981' }}>{deposit.amount}</Typography>
                      <Typography variant="body2" sx={{ color: '#666666' }}>{deposit.time}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="text"
                    endIcon={<ChevronRightIcon />}
                    
                    sx={{ 
                      color: '#3B82F6',
                      textTransform: 'none',
                      padding: '8px 20px',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        color: '#2563EB',
                        backgroundColor: 'transparent', 
                      }
                    }}
                  >
                    More
                  </Button>
                </Box>
              </TabPanel>

              <TabPanel value={selectedTab} index={1}>
                {/* Recent Deposits Table */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr',
                  bgcolor: '#F8F8F8',
                  p: '8px 20px',
                  borderRadius: '4px'
                }}>
                  <Typography variant="subtitle2" color="#666666">Token</Typography>
                  <Typography variant="subtitle2" color="#666666">Amount</Typography>
                  <Typography variant="subtitle2" color="#666666">Time</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {recentDeposits.map((deposit: DepositRecord, index: number) => (
                    <Box
                      key={`recent-${index}`}
                      sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr',
                        p: '8px 20px', // Following Element Plus padding guideline
                        borderBottom: '1px solid #E5E7EB',
                        color: '#666666',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(64, 158, 255, 0.1)' // Element Plus primary color with opacity
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>{deposit.token}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#10B981' }}>{deposit.amount}</Typography>
                      <Typography variant="body2" sx={{ color: '#666666' }}>{deposit.time}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="text"
                    endIcon={<ChevronRightIcon />}
                    sx={{ 
                      color: '#3B82F6',
                      textTransform: 'none',
                      padding: '8px 20px',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        color: '#2563EB',
                        backgroundColor: 'transparent', 
                      }
                    }}
                  >
                    More
                  </Button>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
}

Deposit.layout = "Blank";
