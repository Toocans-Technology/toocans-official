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

import mainContainerStyle from './styles/mainContainerStyle';
import { typographyStyle, cardStyle, cardContentStyle, innerBoxStyle } from './styles/pageStyles';
import { DepositRecord } from '@/app/deposit/types';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TokenDropdown, { TokenOption } from '@/app/components/shared/TokenDropdown';
import LpHeader from '@/app/components/landingpage/header/Header';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { color } from 'framer-motion';

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

// Function to render a step indicator
const StepIndicator = ({ step, active }: { step: number, active: boolean }) => (
  <Box
    sx={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      bgcolor: active ? '#000' : '#999999', // #000 if active, otherwise #999999
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 2,
      fontWeight: 'bold',
      fontSize: '14px'
    }}
  >
    {step}
  </Box>
);

import DepositSteps from './components/DepositSteps';
import DepositHistoryTabs from './components/DepositHistoryTabs';

export default function Deposit() {
  // Deposit data
  const usdtDeposits: DepositRecord[] = [
    {
      id: 1,
      token: 'USDT',
      amount: '+ 102.12',
      time: '2021-05-21 13:20:00',
      email: 'ex***@gm***',
      phone: '12***123',
      network: 'TRON',
      status: 'completed'
    },
    {
      id: 2,
      token: 'USDT',
      amount: '+ 200',
      time: '2021-05-21 13:20:00',
      email: 'ex***@gm***',
      phone: '12***123',
      network: 'TRON',
      status: 'completed'
    }
  ];

  const recentDeposits: DepositRecord[] = [
    {
      id: 3,
      token: 'BTC',
      amount: '+ 0.0023',
      time: '2021-05-21 13:20:00',
      email: 'ex***@gm***',
      phone: '12***123',
      network: 'ETH',
      status: 'pending'
    },
    {
      id: 4,
      token: 'ETH',
      amount: '+ 1.5',
      time: '2021-05-21 13:20:00',
      email: 'ex***@gm***',
      phone: '12***123',
      network: 'ETH',
      status: 'completed'
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
      <Box sx={mainContainerStyle}>
        <Box sx={innerBoxStyle}>
          <Typography variant="h2" sx={typographyStyle}>Deposit</Typography>
          {/* Deposit Form Card */}
          <Card sx={cardStyle}>
            <CardContent sx={cardContentStyle}>
              <DepositSteps 
                selectedCrypto={selectedCrypto}
                selectedNetwork={selectedNetwork}
                handleCryptoSelection={handleCryptoSelection}
                handleNetworkSelection={handleNetworkSelection}
                cryptocurrencies={cryptocurrencies}
                networks={networks}
                showCopyNotification={showCopyNotification}
                setShowCopyNotification={setShowCopyNotification}
              />
            </CardContent>
          </Card>

        
          <DepositHistoryTabs 
                selectedTab={selectedTab}
                handleTabChange={handleTabChange}
                usdtDeposits={usdtDeposits}
                recentDeposits={recentDeposits}
              />
        </Box>
      </Box>
    </PageContainer>
  );
}

Deposit.layout = "Blank";
