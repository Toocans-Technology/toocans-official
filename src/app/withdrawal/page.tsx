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
  ListItemText,
  Input,
  InputAdornment
} from '@mui/material';

import { WithdrawalRecord } from './types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TokenDropdown, { TokenOption } from '@/app/components/shared/TokenDropdown';
import LpHeader from '@/app/components/landingpage/header/Header';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { color } from 'framer-motion';
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { maskAddress } from '@/utils/maskUtils';
import WithdrawalForm from './components/WithdrawalForm';
import WithdrawalTabs from './components/WithdrawalTabs';

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

export default function Withdrawal() {
  // Withdrawal data
  const usdtDeposits: WithdrawalRecord[] = [
    {
      id: '1',
      token: 'USDT',
      amount: 102.12,
      currency: 'USDT',
      address: '0x59dC29b1e0cf3463a4Db4A1d6769505d4c61D1c2',
      state: 'completed',
      time: '2021-05-21 13:20:00',
      timestamp: '2021-05-21T13:20:00Z'
    },
    {
      id: '2',
      token: 'USDT',
      amount: 200,
      currency: 'USDT',
      address: '0x59dC29b1e0cf3463a4Db4A1d6769505d4c61D1c2',
      state: 'completed',
      time: '2021-05-21 13:20:00',
      timestamp: '2021-05-21T13:20:00Z'
    }
  ];

  const recentWithdrawals: WithdrawalRecord[] = [
    {
      id: '3',
      token: 'BTC',
      amount: 0.0023,
      currency: 'BTC',
      address: '0x59dC29b1e0cf3463a4Db4A1d6769505d4c61D1c2',
      state: 'completed',
      time: '2021-05-21 13:20:00',
      timestamp: '2021-05-21T13:20:00Z'
    },
    {
      id: '4',
      token: 'ETH',
      amount: 1.5,
      currency: 'ETH',
      address: '0x59dC29b1e0cf3463a4Db4A1d6769505d4c61D1c2',
      state: 'completed',
      time: '2021-05-21 13:20:00',
      timestamp: '2021-05-21T13:20:00Z'
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
  
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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
        display: 'flex',
        flexDirection: 'column',
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

        <Box sx={{ maxWidth: 942, mx: 'auto', padding: 0 }}>
        <Typography variant="h2" sx={{ mb: 2, color: '#000' }}>Withdrawal</Typography>

          {/* Withdrawal Form Card */}
          <Card sx={{ width: 942,borderRadius: 2, bgcolor: '#fff', color: '#666666', mb: 4}}>

            <WithdrawalForm 
              cryptocurrencies={cryptocurrencies}
              selectedCrypto={selectedCrypto}
              handleCryptoSelection={handleCryptoSelection}
              networks={networks}
              selectedNetwork={selectedNetwork}
              handleNetworkSelection={handleNetworkSelection}
            />

          </Card>

          <WithdrawalTabs 
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            usdtDeposits={usdtDeposits}
            recentWithdrawals={recentWithdrawals}
          />

        </Box>
      </Box>
    </PageContainer>
  );
}

Withdrawal.layout = "Blank";
